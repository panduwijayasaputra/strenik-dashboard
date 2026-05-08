import { Injectable, computed, signal } from '@angular/core';

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  iconUrl?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'New user registered',
    description: 'John Doe has just created an account.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
  },
  {
    id: '2',
    title: 'Product low in stock',
    description: 'Widget Pro is down to 3 remaining units.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
  },
  {
    id: '3',
    title: 'Monthly report ready',
    description: 'Your April analytics report is available.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: '4',
    title: 'Server backup complete',
    description: 'Scheduled backup finished with no errors.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '5',
    title: 'New comment on your post',
    description: 'Jane Smith replied to your announcement.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
  },
];

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  readonly notifications = signal<Notification[]>(MOCK_NOTIFICATIONS);

  readonly unreadCount = computed(
    () => this.notifications().filter(n => !n.read).length
  );

  markRead(id: string): void {
    this.notifications.update(items =>
      items.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }

  markAllRead(): void {
    this.notifications.update(items => items.map(n => ({ ...n, read: true })));
  }
}
