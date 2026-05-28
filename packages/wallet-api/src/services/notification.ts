/**
 * Notification service — Pearl stub. No server-driven notifications.
 */

import { NotificationListItem } from '@unisat/wallet-shared'
import type { BaseHttpClient } from '../client/http-client'

export class NotificationService {
  constructor(private readonly httpClient: BaseHttpClient) {
    void this.httpClient
  }

  async getList(): Promise<{ list: NotificationListItem[]; total: number }> {
    return { list: [], total: 0 }
  }

  async read(_notificationId: string): Promise<{ success: boolean }> {
    return { success: true }
  }

  async readAll(_notificationIds: string[]): Promise<{ success: boolean }> {
    return { success: true }
  }
}
