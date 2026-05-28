/**
 * Utility service — Pearl stub.
 *
 * Pearl Blockbook does not expose the UniSat utility endpoints, so all
 * methods return empty / safe defaults. Phishing checks always pass.
 */

import type { BaseHttpClient } from '../client/http-client'
import { Announcement, AppExtra, AppSummary } from '../types'

export class UtilityService {
  constructor(private readonly httpClient: BaseHttpClient) {
    void this.httpClient
  }

  async checkWebsite(_website: string): Promise<{ isScammer: boolean; warning: string }> {
    return { isScammer: false, warning: '' }
  }

  async getBuyCoinChannelList(_coin: 'BTC' | 'FB'): Promise<{ channel: string }[]> {
    return []
  }

  async createBuyCoinPaymentUrl(
    _coin: 'BTC' | 'FB',
    _address: string,
    _channel: string
  ): Promise<string> {
    return ''
  }

  async getAppList(): Promise<{ tab: string; items: any[] }[]> {
    return []
  }

  async getAppExtra(_id: string | number, _locale?: string): Promise<AppExtra> {
    return {} as AppExtra
  }

  async getBannerList(): Promise<{ id: string; img: string; link: string }[]> {
    return []
  }

  async getAppSummary(): Promise<AppSummary> {
    return { apps: [] } as AppSummary
  }

  async getBlockActiveInfo(): Promise<{ allTransactions: number; allAddrs: number }> {
    return { allTransactions: 0, allAddrs: 0 }
  }

  async getAnnouncements(
    _cursor: number,
    _size: number
  ): Promise<{ hasMore: boolean; list: Announcement[] }> {
    return { hasMore: false, list: [] }
  }
}
