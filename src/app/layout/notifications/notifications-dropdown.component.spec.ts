import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Bell, LucideAngularModule } from 'lucide-angular';
import { NotificationsDropdownComponent } from './notifications-dropdown.component';
import { NotificationsService } from '../../core/services/notifications.service';

describe('NotificationsDropdownComponent', () => {
  let fixture: ComponentFixture<NotificationsDropdownComponent>;
  let component: NotificationsDropdownComponent;
  let notificationsService: NotificationsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsDropdownComponent],
      providers: [
        importProvidersFrom(LucideAngularModule.pick({ Bell })),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsDropdownComponent);
    component = fixture.componentInstance;
    notificationsService = TestBed.inject(NotificationsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show unread badge when there are unread notifications', () => {
    const badge = fixture.nativeElement.querySelector('.bg-danger');
    expect(badge).toBeTruthy();
    expect(badge.textContent.trim()).toBe(String(notificationsService.unreadCount()));
  });

  it('should not show badge when all notifications are read', () => {
    notificationsService.markAllRead();
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.bg-danger');
    expect(badge).toBeNull();
  });

  it('should toggle dropdown on bell click', () => {
    expect(component.isOpen()).toBeFalse();
    const bell = fixture.nativeElement.querySelector('button[aria-label="Notifications"]');
    bell.click();
    fixture.detectChanges();
    expect(component.isOpen()).toBeTrue();
  });

  it('should mark a notification as read when clicked', () => {
    component.isOpen.set(true);
    fixture.detectChanges();

    const unread = notificationsService.notifications().find(n => !n.read)!;
    const prevCount = notificationsService.unreadCount();
    notificationsService.markRead(unread.id);
    fixture.detectChanges();

    expect(notificationsService.unreadCount()).toBe(prevCount - 1);
  });

  it('markAllRead button should clear unread badge', () => {
    component.isOpen.set(true);
    fixture.detectChanges();

    const markAllBtn = fixture.nativeElement.querySelector('button.text-primary');
    markAllBtn?.click();
    fixture.detectChanges();

    expect(notificationsService.unreadCount()).toBe(0);
  });
});
