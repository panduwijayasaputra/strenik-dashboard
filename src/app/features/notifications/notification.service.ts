import { Injectable, computed, signal } from '@angular/core';
import { Notification } from './notification.model';

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'New audit assigned', description: 'You have been assigned to Q2 Audit.', timestamp: new Date(Date.now() - 5 * 60 * 1000), read: false },
  { id: '2', title: 'Finding resolved', description: 'Finding #42 has been resolved.', timestamp: new Date(Date.now() - 30 * 60 * 1000), read: false },
  { id: '3', title: 'Report ready', description: 'Your April audit report is available.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), read: true },
];

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly notifications = signal<Notification[]>(MOCK_NOTIFICATIONS);
  readonly unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

  markRead(id: string): void {
    this.notifications.update(items => items.map(n => n.id === id ? { ...n, read: true } : n));
  }

  markAllRead(): void {
    this.notifications.update(items => items.map(n => ({ ...n, read: true })));
  }
}
