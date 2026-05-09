import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Upload, LucideAngularModule } from 'lucide-angular';
import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
  let fixture: ComponentFixture<FileUploadComponent>;
  let component: FileUploadComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadComponent, LucideAngularModule.pick({ Upload })],
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getFileInput(): HTMLInputElement {
    return fixture.debugElement.query(By.css('input[type="file"]')).nativeElement;
  }

  function getTriggerButton(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('button')).nativeElement;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a hidden file input', () => {
    const input = getFileInput();
    expect(input).toBeTruthy();
    expect(input.type).toBe('file');
  });

  it('should render a trigger button', () => {
    expect(getTriggerButton()).toBeTruthy();
  });

  describe('accept and multiple inputs', () => {
    it('should pass accept attribute to the file input', () => {
      fixture.componentRef.setInput('accept', 'image/*');
      fixture.detectChanges();
      expect(getFileInput().accept).toBe('image/*');
    });

    it('should pass multiple attribute to the file input', () => {
      fixture.componentRef.setInput('multiple', true);
      fixture.detectChanges();
      expect(getFileInput().multiple).toBeTrue();
    });

    it('should not set multiple by default', () => {
      expect(getFileInput().multiple).toBeFalse();
    });
  });

  describe('disabled state', () => {
    it('should disable the trigger button when disabled is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(getTriggerButton().disabled).toBeTrue();
    });

    it('should enable the button when disabled is false', () => {
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();
      expect(getTriggerButton().disabled).toBeFalse();
    });
  });

  describe('filesSelected output', () => {
    it('should emit File[] when files are selected', () => {
      const emitted: File[][] = [];
      component.filesSelected.subscribe((files: File[]) => emitted.push(files));

      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      const input = getFileInput();
      Object.defineProperty(input, 'files', { value: dataTransfer.files, configurable: true });
      input.dispatchEvent(new Event('change'));

      expect(emitted.length).toBe(1);
      expect(emitted[0][0].name).toBe('test.txt');
    });

    it('should not emit when no files are selected', () => {
      const emitted: File[][] = [];
      component.filesSelected.subscribe((files: File[]) => emitted.push(files));

      const input = getFileInput();
      Object.defineProperty(input, 'files', { value: null, configurable: true });
      input.dispatchEvent(new Event('change'));

      expect(emitted.length).toBe(0);
    });
  });

  describe('file name display', () => {
    it('should show the selected file name after selection', () => {
      const file = new File([''], 'photo.png', { type: 'image/png' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      const input = getFileInput();
      Object.defineProperty(input, 'files', { value: dataTransfer.files, configurable: true });
      input.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain('photo.png');
    });

    it('should show multiple file names when multiple files are selected', () => {
      fixture.componentRef.setInput('multiple', true);
      fixture.detectChanges();

      const f1 = new File([''], 'a.png');
      const f2 = new File([''], 'b.png');
      const dt = new DataTransfer();
      dt.items.add(f1);
      dt.items.add(f2);

      const input = getFileInput();
      Object.defineProperty(input, 'files', { value: dt.files, configurable: true });
      input.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain('a.png');
      expect(el.textContent).toContain('b.png');
    });
  });
});
