import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full max-w-sm">
      <h2 class="text-2xl font-bold text-foreground mb-6">Create an account</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
        <!-- Name -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-foreground mb-1" for="name">Name</label>
          <input
            id="name"
            type="text"
            formControlName="name"
            class="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Your name"
          />
          @if (name.invalid && name.touched) {
            <p class="mt-1 text-xs text-danger">Name is required.</p>
          }
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-foreground mb-1" for="email">Email</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            class="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="you@example.com"
          />
          @if (email.invalid && email.touched) {
            @if (email.errors?.['required']) {
              <p class="mt-1 text-xs text-danger">Email is required.</p>
            } @else if (email.errors?.['email']) {
              <p class="mt-1 text-xs text-danger">Enter a valid email address.</p>
            }
          }
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-foreground mb-1" for="password">Password</label>
          <input
            id="password"
            type="password"
            formControlName="password"
            class="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
          @if (password.invalid && password.touched) {
            @if (password.errors?.['required']) {
              <p class="mt-1 text-xs text-danger">Password is required.</p>
            } @else if (password.errors?.['minlength']) {
              <p class="mt-1 text-xs text-danger">Password must be at least 8 characters.</p>
            }
          }
        </div>

        <!-- Confirm Password -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-foreground mb-1" for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            formControlName="confirmPassword"
            class="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
          @if (confirmPassword.touched && form.errors?.['passwordMismatch']) {
            <p class="mt-1 text-xs text-danger">Passwords do not match.</p>
          }
        </div>

        <!-- Error message -->
        @if (errorMessage()) {
          <p class="mb-4 text-sm text-danger">{{ errorMessage() }}</p>
        }

        <!-- Submit -->
        <button
          type="submit"
          [disabled]="isLoading()"
          class="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {{ isLoading() ? 'Creating account...' : 'Create account' }}
        </button>
      </form>

      <p class="mt-4 text-sm text-center text-muted">
        Already have an account? <a routerLink="/auth/login" class="text-primary hover:underline">Sign in</a>
      </p>
    </div>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');

  form = this.fb.group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator },
  );

  get name() { return this.form.controls.name; }
  get email() { return this.form.controls.email; }
  get password() { return this.form.controls.password; }
  get confirmPassword() { return this.form.controls.confirmPassword; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMessage.set('');
    this.isLoading.set(true);
    this.authService
      .register(this.name.value!, this.email.value!, this.password.value!)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/auth/login']),
        error: () => this.errorMessage.set('Registration failed. Please try again.'),
      });
  }
}
