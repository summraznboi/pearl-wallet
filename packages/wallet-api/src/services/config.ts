/**
 * Configuration service — Pearl stub.
 *
 * Pearl Blockbook does not expose UniSat-style /v5/default/* endpoints,
 * so all methods return static / empty defaults.
 */

import type { BaseHttpClient } from '../client/http-client'
import type {
  WalletConfig,
  AppSummary,
  VersionDetail,
  CoinPrice,
  TickPriceItem,
} from '../types'

export class ConfigService {
  constructor(private readonly httpClient: BaseHttpClient) {
    void this.httpClient
  }

  async getWalletConfig(): Promise<WalletConfig> {
    return {
      version: '',
      endpoint: '',
      endpoints: [],
      chainType: 0 as any,
      enabledFeatures: [],
      feeRates: { slow: 1, standard: 2, fast: 5 },
      limits: {
        maxTransactionSize: 100000,
        maxFeeRate: 1000,
        minFeeRate: 1,
        maxUtxos: 1000,
      },
    } as any as WalletConfig
  }

  async getAppList(): Promise<{
    apps: AppSummary[]
    featured: AppSummary[]
    categories: Array<{ id: string; name: string; apps: AppSummary[] }>
  }> {
    return { apps: [], featured: [], categories: [] }
  }

  async getBannerList() {
    return [] as Array<{
      id: string
      title: string
      description?: string
      imageUrl: string
      link?: string
      startTime?: number
      endTime?: number
      priority: number
      target: 'all' | 'mobile' | 'extension'
    }>
  }

  async getBlockActiveInfo() {
    return {
      allTransactions: 0,
      allAddrs: 0,
      currentHeight: 0,
      recentBlocks: [],
    }
  }

  async getVersionDetail(version: string): Promise<VersionDetail> {
    return { version, title: '', changelogs: [], notice: '' }
  }

  async getBitcoinPrice(): Promise<CoinPrice> {
    return { btc: 0, fb: 0 }
  }

  async getTickPrices(ticks: string[]): Promise<TickPriceItem[]> {
    return ticks.map(() => ({ curPrice: 0, changePercent: 0 }))
  }

  async getBabylonConfig(): Promise<any> {
    return null
  }
}
