# Task List: Admin Layout

Based on: `docs/prd/prd-admin-layout.md`

## Relevant Files

### New Files
- `src/app/core/navigation/nav-item.model.ts` - `NavItem` interface definition. ✓
- `src/app/core/navigation/nav-items.config.ts` - Static `NAV_ITEMS` config (typed `NavItem[]`). ✓
- `src/app/core/layouts/admin-layout/admin-layout.component.ts` - Root shell component wrapping sidebar + navbar + router-outlet. ✓
- `src/app/core/layouts/admin-layout/admin-layout.component.html` - Shell template. ✓
- `src/app/core/layouts/admin-layout/admin-layout.component.spec.ts` - Unit tests for the shell.
- `src/app/core/services/layout.service.ts` - Signals for sidebar expanded state and mobile drawer open state. ✓
- `src/app/shared/components/sidebar/sidebar.component.ts` - Collapsible sidebar (stub, full impl task 2.0). ✓
- `src/app/shared/components/top-navbar/top-navbar.component.ts` - Top navbar (stub, full impl task 4.0). ✓
- `src/app/shared/components/breadcrumb/breadcrumb.component.ts` - Breadcrumb (stub, full impl task 5.0). ✓
- `src/app/core/services/layout.service.spec.ts` - Unit tests for LayoutService.
- `src/app/core/services/notifications.service.ts` - Signal-based mock notifications store.
- `src/app/core/services/notifications.service.spec.ts` - Unit tests for NotificationsService.
- `src/app/core/services/breadcrumb.service.ts` - Reads router events and extracts `data.breadcrumb` from the active route tree.
- `src/app/core/services/breadcrumb.service.spec.ts` - Unit tests for BreadcrumbService.
- `src/app/shared/components/sidebar/sidebar.component.ts` - Collapsible sidebar with mini mode.
- `src/app/shared/components/sidebar/sidebar.component.html` - Sidebar template.
- `src/app/shared/components/sidebar/sidebar.component.spec.ts` - Sidebar unit tests.
- `src/app/shared/components/sidebar/nav-group/nav-group.component.ts` - Collapsible nav group (parent item with children).
- `src/app/shared/components/sidebar/nav-item/nav-item.component.ts` - Individual leaf nav item.
- `src/app/shared/components/top-navbar/top-navbar.component.ts` - Top navbar shell.
- `src/app/shared/components/top-navbar/top-navbar.component.html` - Navbar template.
- `src/app/shared/components/top-navbar/top-navbar.component.spec.ts` - Navbar unit tests.
- `src/app/shared/components/notifications/notifications-dropdown.component.ts` - Bell icon + unread badge + dropdown list.
- `src/app/shared/components/notifications/notifications-dropdown.component.html` - Notifications dropdown template.
- `src/app/shared/components/notifications/notifications-dropdown.component.spec.ts` - Notifications unit tests.
- `src/app/shared/components/profile-dropdown/profile-dropdown.component.ts` - Avatar + MatMenu profile dropdown.
- `src/app/shared/components/profile-dropdown/profile-dropdown.component.html` - Profile dropdown template.
- `src/app/shared/components/theme-switcher/theme-switcher.component.ts` - Mode + palette picker (reused in navbar and sidebar footer).
- `src/app/shared/components/theme-switcher/theme-switcher.component.html` - Theme switcher template.
- `src/app/shared/components/breadcrumb/breadcrumb.component.ts` - Renders auto-generated breadcrumb trail.
- `src/app/shared/components/breadcrumb/breadcrumb.component.html` - Breadcrumb template.
- `src/app/shared/components/breadcrumb/breadcrumb.component.spec.ts` - Breadcrumb unit tests.

### Modified Files
- `src/app/app.routes.ts` - Add protected routes wrapped under `AdminLayoutComponent`; add `data.breadcrumb` to route definitions. ✓
- `src/app/core/theme/theme.service.ts` - Consumed (not modified) by ThemeSwitcherComponent.
- `src/app/core/auth/auth.service.ts` - `currentUser` signal consumed by ProfileDropdownComponent.

### Notes
- Run tests with `pnpm test` (Vitest).
- All components must be standalone with `ChangeDetectionStrategy.OnPush`.
- Use Angular Signals for all reactive state — no RxJS Subjects for UI state.
- Use semantic Tailwind color tokens only (`bg-surface`, `text-foreground`, `border-border`, etc.).
- Use Lucide Angular for all icons.
- Use `MatTooltipModule` for mini-sidebar tooltips and `MatMenuModule` for the profile dropdown.

---

## Tasks

- [x] 1.0 Layout Shell & Routing
  - [x] 1.1 Create the `NavItem` model and `NAV_ITEMS` static config
    - Create `src/app/core/navigation/nav-item.model.ts` and define the `NavItem` interface:
      ```ts
      export interface NavItem {
        label: string;
        icon: string;          // Lucide icon name
        route?: string;        // leaf items only
        children?: NavItem[];  // group items only
      }
      ```
    - Create `src/app/core/navigation/nav-items.config.ts` and export a `NAV_ITEMS: NavItem[]` array with at least the following top-level entries (with realistic children where applicable): Dashboard, Users (with children: List, Create), Products (with children: List, Create), Settings, Profile.
    - This config will be injected into the sidebar — no routing logic here, just data.
  - [x] 1.2 Create `AdminLayoutComponent` shell
    - Create `src/app/core/layouts/admin-layout/admin-layout.component.ts` as a standalone component with `ChangeDetectionStrategy.OnPush`.
    - The template (`admin-layout.component.html`) must compose the three regions using CSS flex:
      - Left: `<app-sidebar>` (hidden on mobile)
      - Right column: `<app-top-navbar>` (fixed top) + `<main>` containing `<app-breadcrumb>` and `<router-outlet>`
    - Import `SidebarComponent`, `TopNavbarComponent`, `BreadcrumbComponent`, and `RouterOutlet`.
    - Add a mobile overlay backdrop `<div>` that shows when the drawer is open (read `layoutService.mobileDrawerOpen` signal); clicking it calls `layoutService.closeMobileDrawer()`.
  - [x] 1.3 Register protected routes under `AdminLayoutComponent`
    - In `src/app/app.routes.ts`, add a route with `component: AdminLayoutComponent` and `canActivate: [authGuard]` as the parent.
    - Nest child routes: `dashboard`, `users`, `products`, `settings`, `profile`.
    - Add `data: { breadcrumb: 'Dashboard' }` (etc.) to each child route definition.
    - Lazy-load each child route's component.
  - [x] 1.4 Write unit tests for `AdminLayoutComponent`
    - Test that the shell renders the sidebar, navbar, and router-outlet.
    - Test that the overlay backdrop is visible when `layoutService.mobileDrawerOpen()` is `true`.

- [x] 2.0 Sidebar (Desktop Collapsible + Mini Mode)
  - [x] 2.1 Create `LayoutService` with sidebar state signal
    - Create `src/app/core/services/layout.service.ts` (providedIn: 'root').
    - Add `sidebarExpanded = signal<boolean>(true)`.
    - Add `mobileDrawerOpen = signal<boolean>(false)`.
    - Add methods: `toggleSidebar()`, `openMobileDrawer()`, `closeMobileDrawer()`.
    - Write unit tests in `layout.service.spec.ts` covering each method and the resulting signal values.
  - [x] 2.2 Create `NavItemComponent` (leaf nav item)
    - Create `src/app/shared/components/sidebar/nav-item/nav-item.component.ts` as standalone OnPush.
    - Inputs: `item: NavItem`, `mini: boolean` (controls label visibility).
    - Render: Lucide icon + label (hidden in mini mode) + `routerLink` + `routerLinkActive="active"`.
    - In mini mode, wrap with `matTooltip` showing the label on the right.
    - Apply active styles using semantic tokens (e.g., `bg-primary/10 text-primary`).
  - [x] 2.3 Create `NavGroupComponent` (collapsible parent group)
    - Create `src/app/shared/components/sidebar/nav-group/nav-group.component.ts` as standalone OnPush.
    - Inputs: `item: NavItem` (with children), `mini: boolean`.
    - Maintain a local `isOpen = signal<boolean>(false)`; toggled by clicking the group header.
    - Animate the children list open/closed using Angular's `@if` with a CSS max-height transition or `@angular/animations`.
    - In mini mode, hide the label; the group header click area still works.
    - Render children using `<app-nav-item>` for each child.
  - [x] 2.4 Create `SidebarComponent`
    - Create `src/app/shared/components/sidebar/sidebar.component.ts` as standalone OnPush.
    - Inject `LayoutService`; read `sidebarExpanded` signal as a computed for the `mini` input passed to nav items.
    - Template structure:
      1. **Logo/Brand area** at top (app logo or text, hidden label in mini mode).
      2. **Nav list** — iterate `NAV_ITEMS`; render `<app-nav-group>` for items with children, `<app-nav-item>` for leaf items.
      3. **Toggle button** (chevron icon) that calls `layoutService.toggleSidebar()`.
      4. **Footer area** — contains `<app-theme-switcher>` (compact variant).
    - Apply conditional width classes: `w-60` (expanded) / `w-16` (mini) with transition.
    - Hidden on mobile via `hidden lg:flex`.
  - [x] 2.5 Write unit tests for sidebar components _(skipped per user request)_
    - `SidebarComponent`: test that it renders nav items from `NAV_ITEMS`; test width class changes when `sidebarExpanded` toggles.
    - `NavGroupComponent`: test that clicking the header toggles `isOpen`; test children visibility.
    - `NavItemComponent`: test `routerLinkActive` class is applied; test tooltip presence in mini mode.

- [x] 3.0 Mobile Drawer
  - [x] 3.1 Add mobile drawer wrapper in `AdminLayoutComponent`
    - In `admin-layout.component.html`, add a `<div>` that is only rendered when `layoutService.mobileDrawerOpen()` is `true` (using `@if`).
    - This div overlays the full screen with a semi-transparent backdrop.
    - Inside the backdrop div, render a `<div class="drawer">` containing `<app-sidebar [mobileMode]="true">`.
    - Add a close button (X icon) inside the drawer that calls `layoutService.closeMobileDrawer()`.
  - [x] 3.2 Add `mobileMode` input to `SidebarComponent`
    - Add `mobileMode = input<boolean>(false)` to `SidebarComponent`.
    - When `mobileMode` is true: always render in expanded state regardless of `sidebarExpanded` signal; remove the toggle button.
    - This allows the drawer to always show the full sidebar without affecting desktop state.
  - [x] 3.3 Animate the drawer
    - Apply CSS transition (`translate-x`) so the drawer slides in from the left when opened and slides out when closed.
    - Use Angular `@angular/animations` or pure CSS with a conditional class.
  - [x] 3.4 Outside-click dismissal
    - In the backdrop div, add `(click)="layoutService.closeMobileDrawer()"` on the backdrop element.
    - Add `(click)="$event.stopPropagation()"` on the inner drawer div so clicks inside the drawer do not close it.
  - [x] 3.5 Wire hamburger button in `TopNavbarComponent`
    - Add a hamburger icon button to the left of the navbar (visible only on mobile via `lg:hidden`).
    - On click, call `layoutService.openMobileDrawer()`.

- [ ] 4.0 Top Navbar, Notifications, Profile Dropdown & Theme Switcher
  - [ ] 4.1 Create `NotificationsService`
    - Create `src/app/core/services/notifications.service.ts` (providedIn: 'root').
    - Define a `Notification` interface: `{ id: string; title: string; description: string; timestamp: Date; read: boolean; iconUrl?: string }`.
    - Expose `notifications = signal<Notification[]>(MOCK_NOTIFICATIONS)` with 5–6 hardcoded mock items.
    - Expose a computed `unreadCount = computed(() => this.notifications().filter(n => !n.read).length)`.
    - Implement `markRead(id: string)`: update the signal — set the matching notification's `read` to `true`.
    - Implement `markAllRead()`: set all notifications' `read` to `true`.
    - Write unit tests covering initial state, `markRead`, and `markAllRead`.
  - [ ] 4.2 Create `NotificationsDropdownComponent`
    - Create `src/app/shared/components/notifications/notifications-dropdown.component.ts` as standalone OnPush.
    - Inject `NotificationsService`.
    - Template: a bell icon button with a badge showing `unreadCount()` (hidden when 0).
    - Clicking the bell toggles an inline dropdown panel (use `@if` with a local `isOpen` signal).
    - The dropdown lists notifications: icon/avatar, title, description, relative timestamp.
    - Read notifications are visually dimmed.
    - A "Mark all as read" button at the top calls `notificationsService.markAllRead()`.
    - Clicking a notification item calls `notificationsService.markRead(n.id)`.
  - [ ] 4.3 Create `ThemeSwitcherComponent`
    - Create `src/app/shared/components/theme-switcher/theme-switcher.component.ts` as standalone OnPush.
    - Input: `variant: 'navbar' | 'sidebar'` — controls layout direction and sizing.
    - Inject the existing `ThemeService`.
    - **Mode row:** three buttons — Light (sun icon), Dark (moon icon), System (monitor icon). Active mode is highlighted.
    - **Palette row:** five color swatches — Blue, Emerald, Violet, Amber, Slate. Active palette is highlighted with a ring.
    - On selection, call `themeService.setMode(mode)` / `themeService.setPalette(palette)` (use whatever API the existing ThemeService exposes).
  - [ ] 4.4 Create `ProfileDropdownComponent`
    - Create `src/app/shared/components/profile-dropdown/profile-dropdown.component.ts` as standalone OnPush.
    - Inject `AuthService` and read `currentUser` signal for name and email.
    - Template: avatar button (`mat-icon-button`) that opens a `matMenu`.
    - Menu header: user avatar, name, email (non-clickable display).
    - Menu items:
      - **View Profile** — `routerLink="/profile"`.
      - **Settings** — `routerLink="/settings"`.
      - **Switch Role (Demo)** — calls `authService.switchDemoRole()` which toggles `currentUser.role` between `admin` and `user`.
      - **Logout** — calls `authService.logout()` then navigates to `/auth/login`.
    - Import `MatMenuModule`, `RouterLink`.
  - [ ] 4.5 Create `TopNavbarComponent`
    - Create `src/app/shared/components/top-navbar/top-navbar.component.ts` as standalone OnPush.
    - Inject `LayoutService`.
    - Template (left to right):
      1. **Hamburger button** (`lg:hidden`) — calls `layoutService.openMobileDrawer()`.
      2. **Search bar** — text input with search icon; on focus, expands slightly (CSS transition). No search logic.
      3. Spacer (`flex-1`).
      4. `<app-theme-switcher variant="navbar">`.
      5. `<app-notifications-dropdown>`.
      6. `<app-profile-dropdown>`.
    - Import all sub-components.
  - [ ] 4.6 Write unit tests for navbar components
    - `NotificationsDropdownComponent`: test badge count, mark-as-read, mark-all-read.
    - `ProfileDropdownComponent`: test user name/email rendered, logout calls `authService.logout()`.
    - `ThemeSwitcherComponent`: test mode and palette buttons call the correct `ThemeService` methods.

- [ ] 5.0 Breadcrumbs
  - [ ] 5.1 Create `BreadcrumbService`
    - Create `src/app/core/services/breadcrumb.service.ts` (providedIn: 'root').
    - Inject Angular `Router` and `ActivatedRoute`.
    - Subscribe to `Router.events` filtered to `NavigationEnd`.
    - On each navigation end, walk the active route tree (`activatedRoute.firstChild` recursion) and collect all `data.breadcrumb` strings from each segment.
    - Expose `breadcrumbs = signal<{ label: string; url: string }[]>([])` updated after each navigation.
    - Write unit tests: test that navigating to `/users/edit/1` produces `['Dashboard', 'Users', 'Edit User']` (given correct route data).
  - [ ] 5.2 Create `BreadcrumbComponent`
    - Create `src/app/shared/components/breadcrumb/breadcrumb.component.ts` as standalone OnPush.
    - Inject `BreadcrumbService`.
    - Template: render a horizontal list of breadcrumb items.
    - All items except the last must be `<a [routerLink]="crumb.url">` links.
    - The last item must be plain `<span>` text (current page).
    - Separate items with a chevron-right icon (Lucide).
    - Hide the entire breadcrumb when the array has fewer than 2 items (e.g., on the dashboard root).
  - [ ] 5.3 Place `BreadcrumbComponent` in the layout
    - Import and add `<app-breadcrumb>` to `admin-layout.component.html`, placed in the `<main>` area directly above `<router-outlet>`.
    - Apply `px-6 py-3` (or equivalent semantic padding).

- [ ] 6.0 Integration, Polish & Verification
  - [ ] 6.1 Verify full layout renders correctly end-to-end
    - Boot the app in the browser (`pnpm start`).
    - Navigate to a protected route and confirm: sidebar renders, nav items are correct, active link is highlighted, breadcrumbs display correctly, navbar shows all controls.
  - [ ] 6.2 Verify sidebar collapse behavior
    - Toggle the sidebar via the toggle button; confirm it transitions from expanded (w-60) to mini (w-16).
    - In mini mode, confirm labels are hidden and tooltips appear on hover.
  - [ ] 6.3 Verify mobile drawer
    - Resize browser to mobile viewport; confirm sidebar is hidden and hamburger button appears.
    - Open the drawer; confirm it slides in and overlay backdrop is visible.
    - Click outside; confirm drawer closes.
  - [ ] 6.4 Verify notifications
    - Confirm unread badge shows correct count.
    - Click a notification; confirm it becomes dimmed (read).
    - Click "Mark all as read"; confirm badge disappears.
  - [ ] 6.5 Verify theme switcher
    - Switch between Light / Dark / System modes; confirm CSS class on `<html>` changes.
    - Switch palette; confirm CSS variables update.
    - Reload the page; confirm selections persist (localStorage).
  - [ ] 6.6 Verify profile dropdown
    - Confirm current user name/email appears.
    - Click "Switch Role (Demo)"; confirm role changes in UI.
    - Click "Logout"; confirm redirect to `/auth/login`.
  - [ ] 6.7 Run all tests and fix any failures
    - Run `pnpm test` and resolve all failing tests.
    - Ensure zero TypeScript strict-mode errors (`pnpm build`).
  - [ ] 6.8 Commit
    - Stage all new and modified files.
    - Commit with message: `feat: add admin layout with sidebar, navbar, notifications, breadcrumbs, and theme switcher`.
