import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Info,
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
  XCircle,
} from 'lucide-angular';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor, authInterceptor])),
    provideAnimations(),
    provideToastr({ positionClass: 'toast-top-right', timeOut: 3000 }),
    importProvidersFrom(
      LucideAngularModule.pick({
        AlertTriangle,
        Bell,
        CheckCircle,
        ChevronDown,
        ChevronLeft,
        ChevronRight,
        Info,
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
        XCircle,
      }),
    ),
  ],
};
