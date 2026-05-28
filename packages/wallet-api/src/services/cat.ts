/**
 * CAT20 / CAT721 service — Pearl stub. CAT tokens are not supported.
 */

import { CAT_VERSION, UserToSignInput } from '@unisat/wallet-shared'
import type { BaseHttpClient } from '../client/http-client'
import type { CAT20Balance, CAT721CollectionInfo } from '../types'

const UNSUPPORTED = (): never => {
  throw new Error('CAT tokens are not supported on Pearl.')
}

export class CATService {
  constructor(private readonly httpClient: BaseHttpClient) {
    void this.httpClient
  }

  async getCAT20List(
    _version: CAT_VERSION,
    _address: string,
    _cursor: number,
    _size: number
  ): Promise<{ list: CAT20Balance[]; total: number }> {
    return { list: [], total: 0 }
  }

  async getAddressCAT20TokenSummary(
    _version: CAT_VERSION,
    _address: string,
    _tokenId: string
  ): Promise<any> {
    return {}
  }

  async getAddressCAT20UtxoSummary(
    _version: CAT_VERSION,
    _address: string,
    _tokenId: string
  ): Promise<any> {
    return {}
  }

  async transferCAT20Step1(
    _version: CAT_VERSION,
    _address: string,
    _pubkey: string,
    _to: string,
    _tokenId: string,
    _amount: string,
    _feeRate: number
  ): Promise<{
    id: string
    commitTx: string
    toSignInputs: UserToSignInput[]
    feeRate: number
  }> {
    return UNSUPPORTED()
  }

  async transferCAT20Step2(
    _version: CAT_VERSION,
    _transferId: string,
    _signedPsbt: string
  ): Promise<{ revealTx: string; toSignInputs: UserToSignInput[] }> {
    return UNSUPPORTED()
  }

  async transferCAT20Step3(
    _version: CAT_VERSION,
    _transferId: string,
    _signedPsbt: string
  ): Promise<{ txid: string }> {
    return UNSUPPORTED()
  }

  async transferCAT20Step1ByMerge(_version: CAT_VERSION, _mergeId: string): Promise<{
    id: string
    commitTx: string
    toSignInputs: UserToSignInput[]
    feeRate: number
  }> {
    return UNSUPPORTED()
  }

  async mergeCAT20Prepare(
    _version: CAT_VERSION,
    _address: string,
    _pubkey: string,
    _tokenId: string,
    _utxoCount: number,
    _feeRate: number
  ): Promise<any> {
    return UNSUPPORTED()
  }

  async getMergeCAT20Status(_version: CAT_VERSION, _mergeId: string): Promise<any> {
    return UNSUPPORTED()
  }

  async getCAT721CollectionList(
    _version: CAT_VERSION,
    _address: string,
    _cursor: number,
    _size: number
  ): Promise<{ list: CAT721CollectionInfo[]; total: number }> {
    return { list: [], total: 0 }
  }

  async getAddressCAT721CollectionSummary(
    _version: CAT_VERSION,
    _address: string,
    _collectionId: string
  ): Promise<any> {
    return {}
  }

  async transferCAT721Step1(
    _version: CAT_VERSION,
    _address: string,
    _pubkey: string,
    _to: string,
    _collectionId: string,
    _localId: string,
    _feeRate: number
  ): Promise<{
    id: string
    commitTx: string
    toSignInputs: UserToSignInput[]
    feeRate: number
  }> {
    return UNSUPPORTED()
  }

  async transferCAT721Step2(
    _version: CAT_VERSION,
    _transferId: string,
    _signedPsbt: string
  ): Promise<{ revealTx: string; toSignInputs: UserToSignInput[] }> {
    return UNSUPPORTED()
  }

  async transferCAT721Step3(
    _version: CAT_VERSION,
    _transferId: string,
    _signedPsbt: string
  ): Promise<{ txid: string }> {
    return UNSUPPORTED()
  }
}
