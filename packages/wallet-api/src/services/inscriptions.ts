/**
 * Inscriptions service — Pearl stub.
 *
 * Pearl is BTC-only; inscriptions / ordinals are not supported. All methods
 * return empty data so callers degrade gracefully.
 */

import type { BaseHttpClient } from '../client/http-client'
import type {
  Inscription,
  InscriptionSummary,
  AppSummary,
  UTXO,
  UTXO_Detail,
} from '../types'

export class InscriptionsService {
  constructor(private readonly httpClient: BaseHttpClient) {
    void this.httpClient
  }

  async getInscriptionUtxo(_inscriptionId: string): Promise<UTXO> {
    throw new Error('Inscriptions are not supported on Pearl.')
  }

  async getInscriptionUtxoDetail(_inscriptionId: string): Promise<UTXO_Detail> {
    throw new Error('Inscriptions are not supported on Pearl.')
  }

  async getInscriptionUtxos(_inscriptionIds: string[]): Promise<UTXO[]> {
    return []
  }

  async getInscriptionInfo(_inscriptionId: string): Promise<Inscription> {
    throw new Error('Inscriptions are not supported on Pearl.')
  }

  async getAddressInscriptions(
    _address: string,
    _cursor: number,
    _size: number
  ): Promise<{ list: Inscription[]; total: number }> {
    return { list: [], total: 0 }
  }

  async getInscriptionSummary(): Promise<InscriptionSummary> {
    return { mintedList: [], inProgressList: [] } as any as InscriptionSummary
  }

  async getAppSummary(): Promise<AppSummary> {
    return { apps: [] } as AppSummary
  }

  async getOrdinalsInscriptions(
    _address: string,
    _cursor: number,
    _size: number
  ): Promise<{ list: Inscription[]; total: number }> {
    return { list: [], total: 0 }
  }
}
