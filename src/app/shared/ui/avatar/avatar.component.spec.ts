import { ComponentFixture, TestBed } from '@angular/core/testing';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, User, Star } from 'lucide-angular';
import { AvatarComponent } from './avatar.component';

describe('AvatarComponent', () => {
  let fixture: ComponentFixture<AvatarComponent>;
  let component: AvatarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarComponent],
      providers: [
        importProvidersFrom(LucideAngularModule.pick({ User, Star })),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders an img when src is set', () => {
    fixture.componentRef.setInput('src', 'https://example.com/avatar.jpg');
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img');
    expect(img).not.toBeNull();
    expect(img.src).toContain('example.com/avatar.jpg');
  });

  it('renders initials when src is null and name is set', () => {
    fixture.componentRef.setInput('src', null);
    fixture.componentRef.setInput('name', 'John Doe');
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img');
    expect(img).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('JD');
  });

  it('falls back to initials when img load fails', () => {
    fixture.componentRef.setInput('src', 'bad-url.jpg');
    fixture.componentRef.setInput('name', 'Alice');
    fixture.detectChanges();

    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('img')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('A');
  });

  it('renders icon when src is null and name is empty', () => {
    fixture.componentRef.setInput('src', null);
    fixture.componentRef.setInput('name', '');
    fixture.componentRef.setInput('icon', Star);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('lucide-icon');
    expect(icon).not.toBeNull();
  });

  it('renders default User icon when src, name, and icon are all absent', () => {
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('lucide-icon');
    expect(icon).not.toBeNull();
  });

  it('applies md wrapper size by default', () => {
    fixture.detectChanges();
    const wrapper = fixture.nativeElement.querySelector('span');
    expect(wrapper.className).toContain('w-10');
    expect(wrapper.className).toContain('h-10');
  });

  it('applies xl wrapper size', () => {
    fixture.componentRef.setInput('size', 'xl');
    fixture.detectChanges();
    const wrapper = fixture.nativeElement.querySelector('span');
    expect(wrapper.className).toContain('w-16');
    expect(wrapper.className).toContain('h-16');
  });

  it('initials background color comes from avatar utility', () => {
    fixture.componentRef.setInput('name', 'Alice');
    fixture.detectChanges();
    const initialsSpan: HTMLElement = fixture.nativeElement.querySelector('span > span');
    const validClasses = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info'];
    const hasColor = validClasses.some(c => initialsSpan.className.includes(c));
    expect(hasColor).toBeTrue();
  });
});
