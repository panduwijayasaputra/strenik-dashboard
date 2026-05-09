import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { of } from 'rxjs';
import {
  FormInputComponent,
  FormTextareaComponent,
  FormRadioGroupComponent,
  FormCheckboxComponent,
  FormSelectComponent,
  FormMultiSelectComponent,
  FormAutocompleteComponent,
  FormDatePickerComponent,
  FormTimePickerComponent,
  FormColorPickerComponent,
  FileUploadComponent,
  DropzoneComponent,
  FormTagsInputComponent,
  WysiwygComponent,
} from '../../../shared/components/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-dev-forms',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    FormInputComponent,
    FormTextareaComponent,
    FormRadioGroupComponent,
    FormCheckboxComponent,
    FormSelectComponent,
    FormMultiSelectComponent,
    FormAutocompleteComponent,
    FormDatePickerComponent,
    FormTimePickerComponent,
    FormColorPickerComponent,
    FileUploadComponent,
    DropzoneComponent,
    FormTagsInputComponent,
    WysiwygComponent,
    MatNativeDateModule,
    NgxMatTimepickerModule,
    QuillModule,
  ],
  template: `
    <div class="p-8 max-w-4xl mx-auto space-y-12">
      <h1 class="text-2xl font-bold text-foreground">Form Components Demo</h1>

      <form [formGroup]="form" class="space-y-12">

        <!-- Input -->
        <section class="space-y-4">
          <h2 class="text-lg font-semibold text-foreground border-b border-input pb-2">Text Input</h2>
          <div class="flex gap-4 items-start flex-wrap">
            <app-form-input formControlName="inputSm" size="sm" placeholder="Small" />
            <app-form-input formControlName="inputMd" size="md" placeholder="Medium" />
            <app-form-input formControlName="inputLg" size="lg" placeholder="Large" />
          </div>
          <app-form-input formControlName="inputDisabled" placeholder="Disabled" [disabled]="true" />
        </section>

        <!-- Textarea -->
        <section class="space-y-4">
          <h2 class="text-lg font-semibold text-foreground border-b border-input pb-2">Textarea</h2>
          <app-form-textarea formControlName="textarea" placeholder="Normal textarea" />
          <app-form-textarea formControlName="textareaAuto" placeholder="Auto-resize textarea" [autoResize]="true" />
          <app-form-textarea formControlName="textareaDisabled" placeholder="Disabled" [disabled]="true" />
        </section>

        <!-- Radio Group -->
        <section class="space-y-4">
          <h2 class="text-lg font-semibold text-foreground border-b border-input pb-2">Radio Group</h2>
          <app-form-radio-group formControlName="radio" [options]="radioOptions" orientation="horizontal" />
          <app-form-radio-group formControlName="radioVertical" [options]="radioOptions" orientation="vertical" />
        </section>

        <!-- Checkbox -->
        <section class="space-y-4">
          <h2 class="text-lg font-semibold text-foreground border-b border-input pb-2">Checkbox</h2>
          <app-form-checkbox formControlName="checkbox" label="Normal checkbox" />
          <app-form-checkbox formControlName="checkboxIndeterminate" label="Indeterminate" [indeterminate]="true" />
          <app-form-checkbox formControlName="checkboxDisabled" label="Disabled" [disabled]="true" />
        </section>

        <!-- Select -->
        <section class="space-y-4">
          <h2 class="text-lg font-semibold text-foreground border-b border-input pb-2">Select</h2>
          <app-form-select formControlName="select" [options]="selectOptions" placeholder="Static options" />
          <app-form-select formControlName="selectObs" [options]="selectOptions$" placeholder="Observable options" />
        </section>

        <!-- Multi-Select -->
        <section class="space-y-4">
          <h2 class="text-lg font-semibold text-foreground border-b border-input pb-2">Multi-Select</h2>
          <app-form-multi-select formControlName="multiSelect" [options]="selectOptions" [maxSelections]="3" placeholder="Max 3 selections" />
        </section>

        <!-- Autocomplete -->
        <section class="space-y-4">
          <h2 class="text-lg font-semibold text-foreground border-b border-input pb-2">Autocomplete</h2>
          <app-form-autocomplete formControlName="autocomplete" [options]="selectOptions" placeholder="Static autocomplete" />
        </section>

        <!-- Date Picker -->
        <section class="space-y-4">
          <h2 class="text-lg font-semibold text-foreground border-b border-input pb-2">Date Picker</h2>
          <app-form-date-picker formControlName="date" placeholder="Pick a date" />
        </section>

        <!-- Time Picker -->
        <section class="space-y-4">
          <h2 class="text-lg font-semibold text-foreground border-b border-input pb-2">Time Picker</h2>
          <div class="flex gap-4 flex-wrap">
            <app-form-time-picker formControlName="time12" [format]="12" placeholder="12-hour" />
            <app-form-time-picker formControlName="time24" [format]="24" placeholder="24-hour" />
          </div>
        </section>

        <!-- Color Picker -->
        <section class="space-y-4">
          <h2 class="text-lg font-semibold text-foreground border-b border-input pb-2">Color Picker</h2>
          <app-form-color-picker formControlName="color" />
        </section>

        <!-- File Upload -->
        <section class="space-y-4">
          <h2 class="text-lg font-semibold text-foreground border-b border-input pb-2">File Upload</h2>
          <app-file-upload (filesSelected)="onFiles($event)" />
        </section>

        <!-- Dropzone -->
        <section class="space-y-4">
          <h2 class="text-lg font-semibold text-foreground border-b border-input pb-2">Dropzone</h2>
          <app-dropzone (filesDropped)="onFiles($event)" />
        </section>

        <!-- Tags Input -->
        <section class="space-y-4">
          <h2 class="text-lg font-semibold text-foreground border-b border-input pb-2">Tags Input</h2>
          <app-form-tags-input formControlName="tags" placeholder="Free-text tags" />
          <app-form-tags-input
            formControlName="tagsWithSuggestions"
            [suggestions]="tagSuggestions"
            placeholder="Tags with suggestions" />
        </section>

        <!-- WYSIWYG -->
        <section class="space-y-4">
          <h2 class="text-lg font-semibold text-foreground border-b border-input pb-2">WYSIWYG Editor</h2>
          <app-wysiwyg formControlName="wysiwyg" placeholder="Start writing..." />
        </section>

      </form>

      <!-- JSON Output -->
      <section class="space-y-2">
        <h2 class="text-lg font-semibold text-foreground border-b border-input pb-2">Form Value</h2>
        <pre
          data-testid="form-json"
          class="rounded border border-input bg-muted p-4 text-xs text-foreground overflow-auto max-h-64">{{ form.value | json }}</pre>
      </section>
    </div>
  `,
})
export class DevFormsComponent {
  readonly radioOptions = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
  ];

  readonly selectOptions = [
    { label: 'Angular', value: 'angular' },
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
  ];

  readonly selectOptions$ = of(this.selectOptions);

  readonly tagSuggestions = ['typescript', 'javascript', 'angular', 'react', 'css', 'html'];

  readonly form = new FormGroup({
    inputSm: new FormControl(''),
    inputMd: new FormControl(''),
    inputLg: new FormControl(''),
    inputDisabled: new FormControl({ value: 'Disabled value', disabled: true }),
    textarea: new FormControl(''),
    textareaAuto: new FormControl(''),
    textareaDisabled: new FormControl({ value: 'Disabled value', disabled: true }),
    radio: new FormControl('a'),
    radioVertical: new FormControl('b'),
    checkbox: new FormControl(false),
    checkboxIndeterminate: new FormControl(false),
    checkboxDisabled: new FormControl({ value: false, disabled: true }),
    select: new FormControl(null),
    selectObs: new FormControl(null),
    multiSelect: new FormControl<unknown[]>([]),
    autocomplete: new FormControl(null),
    date: new FormControl<Date | null>(null),
    time12: new FormControl(''),
    time24: new FormControl(''),
    color: new FormControl('#3b82f6'),
    tags: new FormControl<string[]>([]),
    tagsWithSuggestions: new FormControl<string[]>([]),
    wysiwyg: new FormControl(''),
  });

  onFiles(files: File[]): void {
    console.log('Files selected:', files);
  }
}
