import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { CardComponent } from './card.component';

@Component({
  standalone: true,
  imports: [CardComponent],
  template: `
    <app-card [noPadding]="noPadding" [elevated]="elevated">
      <span card-header>Header</span>
      <span card-body>Body</span>
      <span card-footer>Footer</span>
    </app-card>
  `,
})
class TestHostComponent {
  noPadding = false;
  elevated = false;
}

describe('CardComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
    hostFixture = TestBed.createComponent(TestHostComponent);
    host = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('renders with shadow-sm by default', () => {
    const card: HTMLElement = hostFixture.nativeElement.querySelector('div');
    expect(card.className).toContain('shadow-sm');
    expect(card.className).not.toContain('shadow-md');
  });

  it('applies shadow-md when elevated is true', () => {
    host.elevated = true;
    hostFixture.detectChanges();
    const card: HTMLElement = hostFixture.nativeElement.querySelector('div');
    expect(card.className).toContain('shadow-md');
    expect(card.className).not.toContain('shadow-sm');
  });

  it('projects header content', () => {
    expect(hostFixture.nativeElement.textContent).toContain('Header');
  });

  it('projects body content', () => {
    expect(hostFixture.nativeElement.textContent).toContain('Body');
  });

  it('projects footer content', () => {
    expect(hostFixture.nativeElement.textContent).toContain('Footer');
  });

  it('applies p-6 to body by default', () => {
    const bodyDiv = hostFixture.nativeElement.querySelectorAll('app-card > div > div')[1];
    expect(bodyDiv.className).toContain('p-6');
  });

  it('removes body padding when noPadding is true', () => {
    host.noPadding = true;
    hostFixture.detectChanges();
    const bodyDiv = hostFixture.nativeElement.querySelectorAll('app-card > div > div')[1];
    expect(bodyDiv.className).not.toContain('p-6');
  });
});
