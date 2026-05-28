/**
 * Pearl bitcoin service — backed by Pearl Blockbook
 * (https://blockbook.pearlresearch.ai/api).
 *
 * Pearl Blockbook is an insight-style v1 API:
 *   GET /address/{addr}  — { balance, totalReceived, totalSent,
 *                            unconfirmedBalance, txApperances,
 *                            transactions: [txid, ...] }
 *                          NOTE: balance fields are **BTC-decimal strings**,
 *                          not satoshis.
 *   GET /utxo/{addr}     — [{ txid, vout, amount, satoshis, height,
 *                             confirmations }]
 *   GET /tx/{txid}       — Bitcoin Core-style tx (values as BTC strings)
 *
 * Asset fields (inscriptions / runes / atomicals) are intentionally empty —
 * Pearl is BTC-only and the wallet hides those tabs.
 */

import { AddressType } from '@unisat/wallet-types'

import type { BaseHttpClient } from '../client/http-client'
import type {
  AddressSummary,
  BitcoinBalance,
  BitcoinBalanceV2,
  UTXO,
  DecodedPsbt,
  UtxoAssets,
  FeeSummary,
} from '../types'

interface BlockbookAddress {
  addrStr: string
  balance: string // BTC decimal string, e.g. "0.0001"
  totalReceived?: string
  totalSent?: string
  unconfirmedBalance?: string // BTC decimal string
  unconfirmedTxApperances?: number
  txApperances?: number
  transactions?: string[]
}

interface BlockbookUtxo {
  txid: string
  vout: number
  amount?: string // BTC decimal string, e.g. "0.0001"
  satoshis?: number // already in sats
  height?: number
  confirmations?: number
}

// Pearl Blockbook returns BTC as strings like "0.0001". Convert to satoshis
// safely (parseFloat can introduce binary-float noise — round at the end).
function btcStringToSats(value: string | undefined): number {
  if (!value) return 0
  const n = parseFloat(value)
  if (!Number.isFinite(n)) return 0
  return Math.round(n * 1e8)
}

function utxoToSats(u: BlockbookUtxo): number {
  if (typeof u.satoshis === 'number') return u.satoshis
  return btcStringToSats(u.amount)
}

export class BitcoinService {
  constructor(private readonly httpClient: BaseHttpClient) { }

  async getAddressSummary(address: string): Promise<AddressSummary> {
    const data = await this.httpClient.get<BlockbookAddress>(`/address/${address}`)
    const balance = btcStringToSats(data.balance)
    return {
      address,
      totalSatoshis: balance,
      btcSatoshis: balance,
      assetSatoshis: 0,
      inscriptionCount: 0,
      atomicalsCount: 0,
      brc20Count: 0,
      brc20Count5Byte: 0,
      arc20Count: 0,
      runesCount: 0,
    }
  }

  async getAddressBalance(address: string): Promise<BitcoinBalance> {
    const data = await this.httpClient.get<BlockbookAddress>(`/address/${address}`)
    const confirmedSats = btcStringToSats(data.balance)
    const pendingSats = btcStringToSats(data.unconfirmedBalance)
    const totalSats = confirmedSats + pendingSats
    const toBtc = (sats: number) => (sats / 1e8).toString()
    return {
      confirm_amount: toBtc(confirmedSats),
      pending_amount: toBtc(pendingSats),
      amount: toBtc(totalSats),
      confirm_btc_amount: toBtc(confirmedSats),
      pending_btc_amount: toBtc(pendingSats),
      btc_amount: toBtc(totalSats),
      confirm_inscription_amount: '0',
      pending_inscription_amount: '0',
      inscription_amount: '0',
      usd_value: '0',
    }
  }

  async getAddressBalanceV2(address: string): Promise<BitcoinBalanceV2> {
    const data = await this.httpClient.get<BlockbookAddress>(`/address/${address}`)
    const confirmedSats = btcStringToSats(data.balance)
    const pendingSats = btcStringToSats(data.unconfirmedBalance)
    return {
      availableBalance: confirmedSats,
      unavailableBalance: pendingSats,
      totalBalance: confirmedSats + pendingSats,
    }
  }

  async getMultiAddressAssets(addresses: string): Promise<AddressSummary[]> {
    const list = addresses.split(',').filter(Boolean)
    return Promise.all(list.map(a => this.getAddressSummary(a)))
  }

  async getFeeSummary(): Promise<FeeSummary> {
    // Mempool.space-style fee quoting via cumulative-vsize percentiles.
    //
    // For each recent block we build a virtual "next block" of capacity
    // MAX_BLOCK_VSIZE. The confirmed transactions take up their actual vsize
    // at their actual fee rate; the remaining slack (block_capacity − used)
    // is treated as virtual empty space available at the relay floor. We then
    // sort all (rate, vsize) entries low-to-high and walk cumulative vsize to
    // pull p20 / p50 / p80 percentiles.
    //
    // For an uncongested chain like Pearl most of the block is slack, so all
    // three percentiles collapse to the floor. We apply minimum-spread between
    // tiers so the wallet still presents a meaningful Slow / Std / Fast ladder.
    // Once Pearl gets busy the percentiles diverge naturally.
    //
    // Pearl is P2TR-only, so per-tx vsize ≈ 11 + 58*nIn + 43*nOut.

    const MAX_BLOCK_VSIZE = 1_000_000 // BTC weight 4M ÷ 4 = 1M vBytes
    const RELAY_FLOOR = 1 // sat/vB
    const cap = 500
    const clamp = (n: number, lo: number) => Math.min(cap, Math.max(lo, Math.round(n)))

    const fallbackFloor = async (): Promise<number> => {
      try {
        const r = await this.httpClient.get<{ result: string }>(`/estimatefee/12`)
        const sats = Math.round(parseFloat(r?.result ?? '0') * 1e5)
        if (Number.isFinite(sats) && sats > 0) return sats
      } catch {
        // ignore
      }
      return RELAY_FLOOR
    }

    let p20 = RELAY_FLOOR
    let p50 = RELAY_FLOOR
    let p80 = RELAY_FLOOR

    try {
      const status = await this.httpClient.get<{ blockbook?: { bestHeight?: number } }>(`/`)
      const tip = status?.blockbook?.bestHeight ?? 0
      if (tip > 0) {
        const sampleCount = 5
        const heights: number[] = []
        for (let i = 0; i < sampleCount && tip - i > 0; i++) heights.push(tip - i)

        const blocks = await Promise.all(
          heights.map(h =>
            this.httpClient
              .get<{ txs?: Array<{ fees?: string; vin?: any[]; vout?: any[] }> }>(`/block/${h}`)
              .catch(() => null)
          )
        )

        const perBlockP20: number[] = []
        const perBlockP50: number[] = []
        const perBlockP80: number[] = []

        for (const block of blocks) {
          const entries: { rate: number; vsize: number }[] = []
          let usedVsize = 0
          let lowestPaidRate = Infinity
          for (const tx of block?.txs ?? []) {
            const feeSat = Math.round(parseFloat(tx.fees ?? '0') * 1e8)
            if (feeSat <= 0) continue // coinbase + zero-fee oddities
            const nIn = tx.vin?.length ?? 0
            const nOut = tx.vout?.length ?? 0
            if (nIn === 0 || nOut === 0) continue
            const vsize = 11 + 58 * nIn + 43 * nOut
            const rate = feeSat / vsize
            if (!Number.isFinite(rate) || rate <= 0) continue
            entries.push({ rate, vsize })
            usedVsize += vsize
            if (rate < lowestPaidRate) lowestPaidRate = rate
          }
          if (entries.length === 0) continue

          // Empty slack in the projected next block, at the relay floor.
          const floorForBlock = Math.min(RELAY_FLOOR, Number.isFinite(lowestPaidRate) ? lowestPaidRate : RELAY_FLOOR)
          const slack = Math.max(0, MAX_BLOCK_VSIZE - usedVsize)
          if (slack > 0) entries.push({ rate: floorForBlock, vsize: slack })

          // Sort ASCENDING by rate, then walk cumulative vsize. pX = the rate
          // at which cumulative weight crosses X% of total weight (== block).
          entries.sort((a, b) => a.rate - b.rate)
          const total = entries.reduce((acc, e) => acc + e.vsize, 0) || 1
          const pickPercentile = (p: number) => {
            const target = total * p
            let acc = 0
            for (const e of entries) {
              acc += e.vsize
              if (acc >= target) return e.rate
            }
            return entries[entries.length - 1]!.rate
          }
          perBlockP20.push(pickPercentile(0.2))
          perBlockP50.push(pickPercentile(0.5))
          perBlockP80.push(pickPercentile(0.8))
        }

        const median = (xs: number[]) => {
          if (!xs.length) return RELAY_FLOOR
          xs.sort((a, b) => a - b)
          return xs[Math.floor(xs.length / 2)]!
        }

        if (perBlockP20.length > 0) {
          p20 = median(perBlockP20)
          p50 = median(perBlockP50)
          p80 = median(perBlockP80)
        } else {
          const floor = await fallbackFloor()
          p20 = p50 = p80 = floor
        }
      } else {
        const floor = await fallbackFloor()
        p20 = p50 = p80 = floor
      }
    } catch {
      const floor = await fallbackFloor()
      p20 = p50 = p80 = floor
    }

    // Pure percentile result, floored at 1 sat/vB. On an uncongested chain
    // all three tiers collapse to 1 — by design.
    const slow = clamp(p20, 1)
    const standard = clamp(p50, 1)
    const fast = clamp(p80, 1)

    return {
      list: [
        { title: 'Slow', desc: '~19 min', feeRate: slow },
        { title: 'Standard', desc: '~9 min', feeRate: standard },
        { title: 'Fast', desc: '~3 min', feeRate: fast },
      ],
    }
  }

  async getLowFeeSummary(): Promise<FeeSummary> {
    return this.getFeeSummary()
  }

  async getAvailableUtxos(address: string): Promise<UTXO[]> {
    return this.getBTCUtxos(address)
  }

  async getUnavailableUtxos(_address: string): Promise<UTXO[]> {
    return []
  }

  async getBTCUtxos(address: string): Promise<UTXO[]> {
    const data = await this.httpClient.get<BlockbookUtxo[]>(`/utxo/${address}`)
    if (!Array.isArray(data)) return []
    return data.map(u => ({
      txid: u.txid,
      vout: u.vout,
      satoshis: utxoToSats(u),
      // Blockbook does not return scriptPk; wallet-background derives it from
      // the (P2TR) address before signing.
      scriptPk: '',
      addressType: AddressType.P2TR,
      inscriptions: [],
      atomicals: [],
      runes: [],
    }))
  }

  async pushTx(rawtx: string): Promise<string> {
    // Pearl Blockbook: POST /sendtx/ with raw hex as the request body.
    // Returns { result: "<txid>" } on success or { error: "..." } (HTTP 400)
    // on rejection — we read the body either way.
    const base = this.httpClient.getBaseURL().replace(/\/+$/, '')
    const url = `${base}/sendtx/`
    console.log('[pearl] broadcasting', { url, hexLen: rawtx.length })

    let res: Response
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: rawtx,
        // Avoid hanging the wallet forever on a stuck node / MV3 worker race.
        signal: AbortSignal.timeout(30000),
      })
    } catch (e: any) {
      console.warn('[pearl] broadcast network error', e)
      throw new Error(`Broadcast network error: ${e?.message || e}`)
    }

    let payload: { result?: string; error?: string } = {}
    try {
      payload = await res.json()
    } catch {
      // non-JSON body — fall through to generic error
    }
    console.log('[pearl] broadcast response', { status: res.status, payload })

    if (payload.result) return payload.result

    // Treat "already-in-mempool" / "already-known" as success — the tx is in.
    const errMsg = payload.error || ''
    if (/already( in mempool| known|-known)/i.test(errMsg) || /-27/.test(errMsg)) {
      // No txid surfaced; return the locally-computed one if the caller passed it.
      return ''
    }

    throw new Error(errMsg || `Broadcast failed: HTTP ${res.status}`)
  }

  async decodePsbt(_psbtHex: string, _website: string): Promise<DecodedPsbt> {
    // Pearl has no remote PSBT decoder; the UI falls back to local decoding.
    throw new Error('Remote PSBT decoding is not supported on Pearl.')
  }

  async getAddressRecentHistory(params: { address: string; start: number; limit: number }) {
    const data = await this.httpClient.get<BlockbookAddress>(`/address/${params.address}`)
    const txids = (data.transactions || []).slice(params.start, params.start + params.limit)
    return {
      start: params.start,
      total: data.txApperances || (data.transactions?.length ?? 0),
      detail: txids.map(txid => ({ txid })),
    } as any
  }

  async createSendCoinBypassHeadOffsets(
    _address: string,
    _pubkey: string,
    _tos: { address: string; satoshis: number }[],
    _feeRate: number,
    _enableRBF = true
  ): Promise<never> {
    throw new Error('Server-side send creation is not supported on Pearl.')
  }

  async findGroupAssets(
    groups: { type: number; address_arr: string[] }[]
  ): Promise<{ type: number; address_arr: string[]; satoshis_arr: number[] }[]> {
    return groups.map(g => ({
      type: g.type,
      address_arr: g.address_arr,
      satoshis_arr: g.address_arr.map(() => 0),
    }))
  }

  async decodeContracts(_contracts: any[], _account: any): Promise<any> {
    return []
  }

  async getUtxoAssetsByOutpoints(outpoints: string[]): Promise<UtxoAssets[]> {
    return outpoints.map(op => {
      const [txid = '', voutStr = '0'] = op.split(':')
      return {
        txid,
        vout: parseInt(voutStr, 10) || 0,
        inscriptions: [],
        runes: [],
        alkanes: [],
      }
    })
  }
}
