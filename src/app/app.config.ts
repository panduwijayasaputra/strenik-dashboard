import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  List,
  LogOut,
  LucideAngularModule,
  Menu,
  Monitor,
  Moon,
  Package,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  User,
  UserPlus,
  Users,
  X,
} from 'lucide-angular';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor, authInterceptor])),
    provideAnimations(),
    importProvidersFrom(
      LucideAngularModule.pick({
        Bell,
        ChevronDown,
        ChevronLeft,
        ChevronRight,
        LayoutDashboard,
        List,
        LogOut,
        Menu,
        Monitor,
        Moon,
        Package,
        PanelLeft,
        PlusCircle,
        Search,
        Settings,
        ShieldCheck,
        Sun,
        User,
        UserPlus,
        Users,
        X,
      }),
    ),
  ],
};
