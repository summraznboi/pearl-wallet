/**
 * Market service — Pearl stub.
 *
 * Pearl Blockbook does not expose pricing endpoints, so all prices are 0.
 */

import type { BaseHttpClient } from '../client/http-client'
import type { CoinPrice, TickPriceItem } from '../types'

export class MarketService {
  constructor(private readonly httpClient: BaseHttpClient) {
    void this.httpClient
  }

  async getCoinPrice(): Promise<CoinPrice> {
    return { btc: 0, fb: 0 }
  }

  async getBrc20sPrice(ticks: string[]): Promise<TickPriceItem> {
    void ticks
    return { curPrice: 0, changePercent: 0 }
  }

  async getRunesPrice(ticks: string[]): Promise<TickPriceItem> {
    void ticks
    return { curPrice: 0, changePercent: 0 }
  }

  async getCAT20sPrice(ticks: string[]): Promise<TickPriceItem> {
    void ticks
    return { curPrice: 0, changePercent: 0 }
  }

  async getAlkanesPrice(ticks: string[]): Promise<TickPriceItem> {
    void ticks
    return { curPrice: 0, changePercent: 0 }
  }
}
