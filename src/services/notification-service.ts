import type { Notification } from '@/lib/data/notifications'
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/lib/data/notifications'

export interface NotificationService {
  list(): Notification[]
  markRead(id: string): void
  markAllRead(): void
}

export const notificationService: NotificationService = {
  list: listNotifications,
  markRead: markNotificationRead,
  markAllRead: markAllNotificationsRead,
}
