import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full max-w-sm">
      <h2 class="text-2xl font-bold text-foreground mb-6">Set a new password</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
        <!-- New Password -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-foreground mb-1" for="password">New Password</label>
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

        <button
          type="submit"
          [disabled]="isLoading()"
          class="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {{ isLoading() ? 'Saving...' : 'Set new password' }}
        </button>
      </form>

      <p class="mt-4 text-sm text-center">
        <a routerLink="/auth/login" class="text-primary hover:underline">Back to sign in</a>
      </p>
    </div>
  `,
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal(false);
  errorMessage = signal('');

  form = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator },
  );

  get password() { return this.form.controls.password; }
  get confirmPassword() { return this.form.controls.confirmPassword; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const token = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.errorMessage.set('');
    this.isLoading.set(true);
    this.authService
      .resetPassword(token, this.password.value!)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/auth/login']),
        error: () => this.errorMessage.set('Reset failed. The link may have expired.'),
      });
  }
}
