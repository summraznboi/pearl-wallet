/**
 * BRC20 service — Pearl stub. BRC-20 is not supported.
 */

import type { BaseHttpClient } from '../client/http-client'
import type {
  AddressTokenSummary,
  BRC20HistoryItem,
  InscribeOrder,
  TickPriceItem,
  TokenBalance,
  TokenTransfer,
  UserToSignInput,
} from '../types'

const UNSUPPORTED = (): never => {
  throw new Error('BRC-20 is not supported on Pearl.')
}

export class BRC20Service {
  constructor(private readonly httpClient: BaseHttpClient) {
    void this.httpClient
  }

  async getBRC20List(_params: {
    address: string
    cursor: number
    size: number
  }): Promise<{ list: TokenBalance[]; total: number }> {
    return { list: [], total: 0 }
  }

  async getAddressTokenSummary(_params: {
    address: string
    ticker: string
    tickerHex?: string
  }): Promise<AddressTokenSummary> {
    return {} as AddressTokenSummary
  }

  async getAddressTokenHistoryList(_params: {
    address: string
    ticker: string
    tickerHex?: string
    cursor: number
    size: number
  }): Promise<{ list: TokenTransfer[]; total: number }> {
    return { list: [], total: 0 }
  }

  async getBRC20RecentHistory(_address: string, _ticker: string): Promise<BRC20HistoryItem[]> {
    return []
  }

  async getTickPrice(_ticker: string): Promise<TickPriceItem> {
    return { curPrice: 0, changePercent: 0 }
  }

  async inscribeBRC20Transfer(
    _address: string,
    _tick: string,
    _amount: string,
    _feeRate: number,
    _outputValue?: number
  ): Promise<InscribeOrder> {
    return UNSUPPORTED()
  }

  async getInscribeResult(_orderId: string): Promise<TokenTransfer> {
    return UNSUPPORTED()
  }

  async getTokenTransferableList(_params: {
    address: string
    ticker: string
    tickerHex?: string
    cursor: number
    size: number
  }): Promise<{ list: TokenTransfer[]; total: number }> {
    return { list: [], total: 0 }
  }

  async singleStepTransferBRC20Step1(_params: {
    userAddress: string
    userPubkey: string
    receiver: string
    ticker: string
    amount: string
    feeRate: number
  }): Promise<{ orderId: string; psbtHex: string; toSignInputs: UserToSignInput[] }> {
    return UNSUPPORTED()
  }

  async singleStepTransferBRC20Step2(_params: {
    orderId: string
    psbt: string
  }): Promise<{ psbtHex: string; toSignInputs: UserToSignInput[] }> {
    return UNSUPPORTED()
  }

  async singleStepTransferBRC20Step3(_params: {
    orderId: string
    psbt: string
  }): Promise<{ txid: string }> {
    return UNSUPPORTED()
  }

  async getBRC20ProgList(_params: {
    address: string
    cursor: number
    size: number
  }): Promise<{ list: TokenBalance[]; total: number }> {
    return { list: [], total: 0 }
  }
}
