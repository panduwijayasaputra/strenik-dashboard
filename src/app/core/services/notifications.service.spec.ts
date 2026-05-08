import { TestBed } from '@angular/core/testing';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have 5 mock notifications on init', () => {
    expect(service.notifications().length).toBe(5);
  });

  it('should report correct initial unread count', () => {
    const unread = service.notifications().filter(n => !n.read).length;
    expect(service.unreadCount()).toBe(unread);
  });

  it('markRead should mark the matching notification as read', () => {
    const unreadItem = service.notifications().find(n => !n.read)!;
    service.markRead(unreadItem.id);
    const updated = service.notifications().find(n => n.id === unreadItem.id)!;
    expect(updated.read).toBe(true);
  });

  it('markRead should not affect other notifications', () => {
    const [first, second] = service.notifications();
    service.markRead(first.id);
    const secondAfter = service.notifications().find(n => n.id === second.id)!;
    expect(secondAfter.read).toBe(second.read);
  });

  it('markAllRead should set all notifications to read', () => {
    service.markAllRead();
    expect(service.notifications().every(n => n.read)).toBe(true);
  });

  it('markAllRead should set unreadCount to 0', () => {
    service.markAllRead();
    expect(service.unreadCount()).toBe(0);
  });
});
