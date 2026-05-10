import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DevFormsComponent } from './dev-forms.component';

describe('DevFormsComponent', () => {
  let fixture: ComponentFixture<DevFormsComponent>;
  let component: DevFormsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevFormsComponent],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(DevFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a heading for the demo page', () => {
    const heading = fixture.debugElement.query(By.css('h1'));
    expect(heading).toBeTruthy();
  });

  it('should display form value JSON output', () => {
    const json = fixture.debugElement.query(By.css('[data-testid="form-json"]'));
    expect(json).toBeTruthy();
  });

  it('should render at least one form-input component', () => {
    const inputs = fixture.debugElement.queryAll(By.css('app-form-input'));
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should render at least one form-textarea component', () => {
    const textareas = fixture.debugElement.queryAll(By.css('app-form-textarea'));
    expect(textareas.length).toBeGreaterThan(0);
  });

  it('should render at least one app-form-select component', () => {
    const selects = fixture.debugElement.queryAll(By.css('app-form-select'));
    expect(selects.length).toBeGreaterThan(0);
  });

  it('should render at least one app-form-tags-input component', () => {
    const tags = fixture.debugElement.queryAll(By.css('app-form-tags-input'));
    expect(tags.length).toBeGreaterThan(0);
  });

  it('should render at least one app-wysiwyg component', () => {
    const wysiwyg = fixture.debugElement.queryAll(By.css('app-wysiwyg'));
    expect(wysiwyg.length).toBeGreaterThan(0);
  });
});
