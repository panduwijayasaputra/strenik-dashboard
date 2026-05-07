import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full max-w-sm">
      <h2 class="text-2xl font-bold text-foreground mb-2">Forgot your password?</h2>
      <p class="text-sm text-muted mb-6">Enter your email and we'll send you a reset link.</p>

      @if (submitted()) {
        <p class="rounded-md bg-success/10 px-4 py-3 text-sm text-success">
          Check your inbox for a reset link.
        </p>
      } @else {
        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
          <!-- Email -->
          <div class="mb-6">
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

          <button
            type="submit"
            [disabled]="isLoading()"
            class="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {{ isLoading() ? 'Sending...' : 'Send reset link' }}
          </button>
        </form>
      }

      <p class="mt-4 text-sm text-center">
        <a routerLink="/auth/login" class="text-primary hover:underline">Back to sign in</a>
      </p>
    </div>
  `,
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  isLoading = signal(false);
  submitted = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  get email() { return this.form.controls.email; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.authService
      .forgotPassword(this.email.value!)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => this.submitted.set(true),
        error: () => this.submitted.set(true), // show success regardless to avoid email enumeration
      });
  }
}
