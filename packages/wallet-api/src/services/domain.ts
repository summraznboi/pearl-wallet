import { BaseHttpClient } from '../client/http-client'

export class DomainService {
  constructor(private readonly httpClient: BaseHttpClient) {
    void this.httpClient
  }

  // Pearl does not support .sats / BTC name domain lookups.
  async getDomainInfo(_domain: string) {
    return null
  }
}
