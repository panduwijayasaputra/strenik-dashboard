import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex min-h-screen">
      <!-- Left: form slot -->
      <div class="flex flex-1 items-center justify-center p-8">
        <router-outlet></router-outlet>
      </div>
      <!-- Right: brand panel (hidden on mobile) -->
      <div class="hidden lg:flex flex-1 flex-col items-center justify-center bg-primary text-white p-12">
        <h1 class="text-3xl font-bold">Strenik Dashboard</h1>
        <p class="mt-4 text-lg opacity-80">Enterprise Angular Template</p>
      </div>
    </div>
  `,
})
export class AuthLayoutComponent {}
