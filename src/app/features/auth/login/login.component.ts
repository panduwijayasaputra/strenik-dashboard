import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full max-w-sm">
      <h2 class="text-2xl font-bold text-foreground mb-6">Sign in to your account</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
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
        <div class="mb-6">
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
          {{ isLoading() ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>

      <div class="mt-4 flex flex-col gap-2 text-sm text-center">
        <a routerLink="/auth/forgot-password" class="text-primary hover:underline">Forgot your password?</a>
        <span class="text-muted">Don't have an account? <a routerLink="/auth/register" class="text-primary hover:underline">Register</a></span>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  get email() { return this.form.controls.email; }
  get password() { return this.form.controls.password; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMessage.set('');
    this.isLoading.set(true);
    this.authService
      .login(this.email.value!, this.password.value!)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: () => this.errorMessage.set('Invalid email or password. Please try again.'),
      });
  }
}
