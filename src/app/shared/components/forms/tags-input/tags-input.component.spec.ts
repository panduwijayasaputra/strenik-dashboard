import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';
import { FormTagsInputComponent } from './tags-input.component';

@Component({
  standalone: true,
  imports: [FormTagsInputComponent, ReactiveFormsModule],
  template: `
    <app-form-tags-input
      [formControl]="ctrl"
      [suggestions]="suggestions"
      [allowDuplicates]="allowDuplicates"
      [placeholder]="placeholder"
      (search)="lastSearch = $event" />
  `,
})
class TestHostComponent {
  ctrl = new FormControl<string[]>([]);
  suggestions: string[] | import('rxjs').Observable<string[]> | null = null;
  allowDuplicates = false;
  placeholder = 'Add tags';
  lastSearch = '';
}

describe('FormTagsInputComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let tagsComponent: FormTagsInputComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    host = hostFixture.componentInstance;
    hostFixture.detectChanges();
    tagsComponent = hostFixture.debugElement
      .query(By.directive(FormTagsInputComponent))
      .componentInstance;
  });

  function getInput(): HTMLInputElement {
    return hostFixture.debugElement.query(By.css('input[type="text"]')).nativeElement;
  }

  function getChips(): HTMLElement[] {
    return hostFixture.debugElement.queryAll(By.css('[data-testid="tag-chip"]')).map(d => d.nativeElement);
  }

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  describe('ControlValueAccessor', () => {
    it('should render existing tags as chips', () => {
      host.ctrl.setValue(['angular', 'react']);
      hostFixture.detectChanges();
      expect(getChips().length).toBe(2);
    });

    it('should disable the input when the form control is disabled', () => {
      host.ctrl.disable();
      hostFixture.detectChanges();
      expect(getInput().disabled).toBeTrue();
    });

    it('should mark as touched on blur', () => {
      expect(host.ctrl.touched).toBeFalse();
      getInput().dispatchEvent(new Event('blur'));
      expect(host.ctrl.touched).toBeTrue();
    });
  });

  describe('free-text tag creation', () => {
    it('should add a tag on Enter key', () => {
      const input = getInput();
      input.value = 'typescript';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      hostFixture.detectChanges();
      expect(host.ctrl.value).toContain('typescript');
    });

    it('should add a tag on comma key', () => {
      const input = getInput();
      input.value = 'vue';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: ',' }));
      hostFixture.detectChanges();
      expect(host.ctrl.value).toContain('vue');
    });

    it('should clear the input after adding a tag', () => {
      const input = getInput();
      input.value = 'svelte';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      hostFixture.detectChanges();
      expect(getInput().value).toBe('');
    });

    it('should not add an empty tag', () => {
      const input = getInput();
      input.value = '';
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(host.ctrl.value).toEqual([]);
    });

    it('should not add a duplicate tag when allowDuplicates is false', () => {
      host.ctrl.setValue(['angular']);
      hostFixture.detectChanges();
      const input = getInput();
      input.value = 'angular';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(host.ctrl.value?.filter(t => t === 'angular').length).toBe(1);
    });

    it('should add a duplicate tag when allowDuplicates is true', () => {
      host.allowDuplicates = true;
      host.ctrl.setValue(['angular']);
      hostFixture.detectChanges();
      const input = getInput();
      input.value = 'angular';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(host.ctrl.value?.filter(t => t === 'angular').length).toBe(2);
    });
  });

  describe('tag removal', () => {
    it('should remove a tag when its dismiss button is clicked', () => {
      host.ctrl.setValue(['angular', 'react']);
      hostFixture.detectChanges();
      const removeBtn = hostFixture.debugElement.queryAll(
        By.css('[data-testid="tag-chip"] button'),
      )[0].nativeElement;
      removeBtn.click();
      hostFixture.detectChanges();
      expect(host.ctrl.value?.length).toBe(1);
    });
  });

  describe('static suggestions', () => {
    beforeEach(() => {
      host.suggestions = ['angular', 'react', 'vue', 'svelte'];
      hostFixture.detectChanges();
    });

    it('should filter suggestions based on typed input', () => {
      const input = getInput();
      input.value = 'ang';
      input.dispatchEvent(new Event('input'));
      hostFixture.detectChanges();
      const filtered = (tagsComponent as unknown as { filteredSuggestions: () => string[] }).filteredSuggestions();
      expect(filtered).toContain('angular');
      expect(filtered.length).toBe(1);
    });

    it('should add a suggestion on selection', () => {
      (tagsComponent as unknown as { addTag: (t: string) => void }).addTag('svelte');
      expect(host.ctrl.value).toContain('svelte');
    });
  });

  describe('Observable suggestions', () => {
    it('should emit search output on input when suggestions is Observable', () => {
      const obs$ = new Subject<string[]>();
      host.suggestions = obs$;
      hostFixture.detectChanges();
      const input = getInput();
      input.value = 'ang';
      input.dispatchEvent(new Event('input'));
      expect(host.lastSearch).toBe('ang');
    });
  });

  describe('error state', () => {
    beforeEach(() => {
      host.ctrl.setValidators(Validators.required);
      host.ctrl.updateValueAndValidity();
      hostFixture.detectChanges();
    });

    afterEach(() => {
      host.ctrl.clearValidators();
      host.ctrl.markAsUntouched();
      host.ctrl.updateValueAndValidity();
    });

    it('should apply input-error when invalid and touched', () => {
      host.ctrl.markAsTouched();
      hostFixture.detectChanges();
      expect(getInput().classList).toContain('input-error');
    });

    it('should not apply input-error when invalid but untouched', () => {
      expect(getInput().classList).not.toContain('input-error');
    });
  });
});
