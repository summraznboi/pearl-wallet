import { NetworkType } from '@unisat/wallet-types'
import { bitcoin } from '../bitcoin-core'

// Pearl uses Bitcoin mainnet parameters but with a custom bech32 prefix.
// Only taproot (P2TR) addresses are supported — base58 (P2PKH / P2SH) is
// inherited unchanged from Bitcoin and is intentionally never produced.
export const pearlNetwork: bitcoin.Network = {
  messagePrefix: '\x18Pearl Signed Message:\n',
  bech32: 'prl',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4,
  },
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  wif: 0x80,
}

/**
 * Convert network type to bitcoinjs-lib network.
 */
export function toPsbtNetwork(networkType: NetworkType) {
  if (networkType === NetworkType.MAINNET) {
    return pearlNetwork
  } else if (networkType === NetworkType.TESTNET) {
    return bitcoin.networks.testnet
  } else {
    return bitcoin.networks.regtest
  }
}

/**
 * Convert bitcoinjs-lib network to network type.
 */
export function toNetworkType(network: bitcoin.Network) {
  if (network.bech32 == pearlNetwork.bech32) {
    return NetworkType.MAINNET
  } else if (network.bech32 == bitcoin.networks.testnet.bech32) {
    return NetworkType.TESTNET
  } else {
    return NetworkType.REGTEST
  }
}
