/**
 * Alkanes service — Pearl stub. Alkanes are not supported.
 */

import type { BaseHttpClient } from '../client/http-client'
import type {
  AlkanesBalance,
  AddressAlkanesTokenSummary,
  UTXO,
  UserToSignInput,
  AlkanesInfo,
  AlkanesCollection,
} from '../types'

export class AlkanesService {
  constructor(private readonly httpClient: BaseHttpClient) {
    void this.httpClient
  }

  async getAlkanesList(
    _address: string,
    _cursor: number,
    _size: number
  ): Promise<{ list: AlkanesBalance[]; total: number }> {
    return { list: [], total: 0 }
  }

  async getAlkanesUtxos(_address: string, _alkaneid: string): Promise<UTXO[]> {
    return []
  }

  async getAddressAlkanesTokenSummary(
    _address: string,
    _alkaneid: string,
    _fetchAvailable?: boolean
  ): Promise<AddressAlkanesTokenSummary> {
    return {} as AddressAlkanesTokenSummary
  }

  async getAlkanesCollectionList(
    _address: string,
    _cursor: number,
    _size: number
  ): Promise<{ list: AlkanesCollection[]; total: number }> {
    return { list: [], total: 0 }
  }

  async getAlkanesCollectionItems(
    _address: string,
    _collectionId: string,
    _cursor: number,
    _size: number
  ): Promise<{ list: AlkanesInfo[]; total: number }> {
    return { list: [], total: 0 }
  }

  async createAlkanesSendTx(_params: {
    userAddress: string
    userPubkey: string
    receiver: string
    alkaneid: string
    amount: string
    feeRate: number
    enableRBF?: boolean
  }): Promise<{ orderId: string; psbtHex: string; toSignInputs: UserToSignInput[] }> {
    throw new Error('Alkanes are not supported on Pearl.')
  }
}
