import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UploadCloud, LucideAngularModule } from 'lucide-angular';
import { DropzoneComponent } from './dropzone.component';

describe('DropzoneComponent', () => {
  let fixture: ComponentFixture<DropzoneComponent>;
  let component: DropzoneComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropzoneComponent, LucideAngularModule.pick({ UploadCloud })],
    }).compileComponents();

    fixture = TestBed.createComponent(DropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getDropzone(): HTMLElement {
    return fixture.debugElement.query(By.css('[data-testid="dropzone"]')).nativeElement;
  }

  function getFileInput(): HTMLInputElement {
    return fixture.debugElement.query(By.css('input[type="file"]')).nativeElement;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the dropzone container', () => {
    expect(getDropzone()).toBeTruthy();
  });

  it('should render a hidden file input for click-to-browse', () => {
    expect(getFileInput()).toBeTruthy();
  });

  describe('accept and multiple inputs', () => {
    it('should pass accept to the hidden file input', () => {
      fixture.componentRef.setInput('accept', 'image/*');
      fixture.detectChanges();
      expect(getFileInput().accept).toBe('image/*');
    });

    it('should pass multiple to the hidden file input', () => {
      fixture.componentRef.setInput('multiple', true);
      fixture.detectChanges();
      expect(getFileInput().multiple).toBeTrue();
    });
  });

  describe('drag events', () => {
    it('should add highlight class on dragover', () => {
      const zone = getDropzone();
      zone.dispatchEvent(new DragEvent('dragover', { bubbles: true }));
      fixture.detectChanges();
      expect(zone.classList).toContain('border-primary');
    });

    it('should remove highlight class on dragleave', () => {
      const zone = getDropzone();
      zone.dispatchEvent(new DragEvent('dragover', { bubbles: true }));
      fixture.detectChanges();
      zone.dispatchEvent(new DragEvent('dragleave', { bubbles: true }));
      fixture.detectChanges();
      expect(zone.classList).not.toContain('border-primary');
    });

    it('should emit filesDropped with dropped files on drop', () => {
      const emitted: File[][] = [];
      component.filesDropped.subscribe((files: File[]) => emitted.push(files));

      const file = new File(['data'], 'dropped.txt', { type: 'text/plain' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      const dropEvent = new DragEvent('drop', {
        bubbles: true,
        dataTransfer,
      });

      getDropzone().dispatchEvent(dropEvent);
      fixture.detectChanges();

      expect(emitted.length).toBe(1);
      expect(emitted[0][0].name).toBe('dropped.txt');
    });

    it('should remove highlight class after drop', () => {
      const zone = getDropzone();
      zone.dispatchEvent(new DragEvent('dragover', { bubbles: true }));
      fixture.detectChanges();

      const dt = new DataTransfer();
      zone.dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer: dt }));
      fixture.detectChanges();

      expect(zone.classList).not.toContain('border-primary');
    });
  });

  describe('click-to-browse', () => {
    it('should emit filesDropped when files are selected via click-to-browse', () => {
      const emitted: File[][] = [];
      component.filesDropped.subscribe((files: File[]) => emitted.push(files));

      const file = new File([''], 'clicked.png');
      const dt = new DataTransfer();
      dt.items.add(file);

      const input = getFileInput();
      Object.defineProperty(input, 'files', { value: dt.files, configurable: true });
      input.dispatchEvent(new Event('change'));

      expect(emitted.length).toBe(1);
      expect(emitted[0][0].name).toBe('clicked.png');
    });
  });

  describe('disabled state', () => {
    it('should apply opacity-50 and pointer-events-none when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const zone = getDropzone();
      expect(zone.classList).toContain('opacity-50');
      expect(zone.classList).toContain('pointer-events-none');
    });
  });
});
