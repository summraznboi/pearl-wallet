/**
 * Runes service — Pearl stub. Runes are not supported.
 */

import type { BaseHttpClient } from '../client/http-client'
import type { RuneBalance, AddressRunesTokenSummary, UTXO } from '../types'

export class RunesService {
  constructor(private readonly httpClient: BaseHttpClient) {
    void this.httpClient
  }

  async getRunesList(
    _address: string,
    _cursor: number,
    _size: number
  ): Promise<{ list: RuneBalance[]; total: number }> {
    return { list: [], total: 0 }
  }

  async getRunesUtxos(_address: string, _runeid: string): Promise<UTXO[]> {
    return []
  }

  async getAddressRunesTokenSummary(
    _address: string,
    _runeid: string
  ): Promise<AddressRunesTokenSummary> {
    return {} as AddressRunesTokenSummary
  }
}
