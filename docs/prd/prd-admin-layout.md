# PRD: Admin Layout

## 1. Introduction / Overview

The Admin Layout is the primary shell used by authenticated users (Admin and Regular User roles). It wraps all protected feature pages and provides consistent navigation, branding, and utility controls across the entire application. It solves the problem of having no shared, reusable shell for the dashboard — without it, every feature page would need to manage its own navigation and chrome.

The layout consists of a collapsible sidebar, a top navbar, and a content area. It is fully responsive: on desktop it supports a collapsible/mini sidebar; on mobile it uses a hamburger-triggered full-screen overlay drawer.

---

## 2. Goals

1. Provide a single, reusable `AdminLayoutComponent` that wraps all protected routes.
2. Deliver a collapsible sidebar (full ↔ mini icon-only) with two-level, collapsible navigation groups driven by a static config.
3. Deliver a top navbar containing search, notifications, profile dropdown, and theme switcher.
4. Generate breadcrumbs automatically from the Angular router's active route.
5. Display a theme switcher in both the top navbar and the sidebar footer.
6. Support a mobile drawer overlay triggered by a hamburger button.
7. All layout components must use OnPush change detection and Angular Signals for state.

---

## 3. User Stories

- As an **Admin**, I want a persistent sidebar so I can navigate to any section of the dashboard without losing my place.
- As a **Regular User**, I want to collapse the sidebar to a mini icon-only view so I have more horizontal space when working.
- As a **mobile user**, I want a hamburger menu that slides open a full-screen overlay so I can navigate on small screens.
- As any **authenticated user**, I want breadcrumbs that automatically reflect my current location in the app so I always know where I am.
- As any **authenticated user**, I want a notifications bell that shows unread count and lets me mark items as read.
- As any **authenticated user**, I want a profile dropdown where I can navigate to my profile, settings, switch my demo role, or log out.
- As any **authenticated user**, I want to switch between light, dark, and system themes — and between accent color palettes — from both the navbar and the sidebar.

---

## 4. Functional Requirements

### 4.1 Admin Layout Shell

1. The system must provide an `AdminLayoutComponent` (standalone) that acts as the root shell for all authenticated/protected routes.
2. The layout must contain three regions: sidebar, top navbar, and main content area (`<router-outlet>`).
3. The layout must be registered as the parent route component for all protected feature routes.

### 4.2 Sidebar

4. The sidebar must support two desktop states: **expanded** (full width with icon + label) and **mini** (icon-only, collapsed).
5. The sidebar must toggle between expanded and mini states via a toggle button visible on desktop.
6. The sidebar must display a logo/brand area at the top.
7. The sidebar navigation must be driven by a static `NAV_ITEMS` config (a TypeScript array exported from a dedicated file).
8. Each nav item must support: icon (Lucide), label, route link, and optional children array.
9. The sidebar must support **two levels** of navigation: top-level items and child items grouped under a collapsible parent.
10. Collapsible parent groups must animate open/close and persist their open/closed state within the session.
11. The active route link must be visually highlighted using Angular's `routerLinkActive`.
12. In mini mode, item labels must be hidden; hovering a mini item must show the label in a tooltip.
13. The sidebar must display a **theme switcher** in its footer area (see §4.6).
14. On mobile (below `lg` breakpoint), the sidebar must be hidden by default.

### 4.3 Mobile Drawer

15. On mobile, a **hamburger button** in the top navbar must open the sidebar as a full-screen overlay drawer.
16. The drawer must slide in from the left with a smooth transition.
17. Tapping outside the drawer or pressing the close button must dismiss it.
18. The mobile drawer must share the same nav config and visual structure as the desktop sidebar.

### 4.4 Top Navbar

19. The top navbar must be fixed to the top of the content area (not the full viewport) and scroll with the sidebar.
20. The navbar must display a **hamburger button** on mobile to toggle the drawer (§4.3).
21. The navbar must display a **search bar** (input with search icon). For this release, search is a UI stub — it opens a visible input but does not execute any search logic.
22. The navbar must display a **notifications bell** icon with a badge showing the unread notification count (see §4.5).
23. The navbar must display a **profile avatar** that opens a dropdown on click (see §4.7).
24. The navbar must display a **theme switcher button/icon** that opens a theme picker panel (see §4.6).

### 4.5 Notifications

25. The notifications bell must display a numeric badge when there are unread notifications.
26. Clicking the bell must open a dropdown panel listing recent notifications.
27. Each notification item must display: icon or avatar, title, short description, and relative timestamp.
28. The dropdown must include a **"Mark all as read"** action that clears the unread badge.
29. Individual notifications must be clickable and mark themselves as read on click.
30. Notification data must be mock/static for this release (a `NotificationsService` with a signal-based store holding hardcoded items).

### 4.6 Theme Switcher

31. The theme switcher must allow selecting the **color mode**: Light, Dark, or System.
32. The theme switcher must allow selecting the **accent color palette**: Blue, Emerald, Violet, Amber, Slate.
33. The selected mode and palette must be persisted to `localStorage` and applied on app load (integrating with the existing Theme System module).
34. The theme switcher UI must appear in **both** the top navbar (as a panel/popover) and the sidebar footer (as an inline control or small panel).

### 4.7 Profile Dropdown

35. Clicking the profile avatar must open a dropdown menu.
36. The dropdown must display the current user's name and email at the top (read from the Auth service/signal).
37. The dropdown must include the following items:
    - **View Profile** — navigates to `/profile`
    - **Settings** — navigates to `/settings`
    - **Switch Role (Demo)** — toggles the current user's role between `admin` and `user` for demo purposes, updating the auth signal
    - **Logout** — calls the auth service logout method and redirects to `/auth/login`

### 4.8 Breadcrumbs

38. Breadcrumbs must be generated automatically by reading Angular's `ActivatedRoute` and router `data` configuration.
39. Each route segment that should appear in breadcrumbs must declare a `breadcrumb: string` key in its route `data`.
40. The breadcrumb component must render a horizontal trail: e.g. `Dashboard / Users / Edit User`.
41. All segments except the last must be clickable links. The last segment must be plain text.
42. The breadcrumb component must update reactively whenever the route changes.

---

## 5. Non-Goals (Out of Scope)

- Real search functionality (autocomplete, results page) — search input is a UI stub only.
- Real-time notifications via WebSocket or SSE — mock data only.
- A bottom navigation bar for mobile.
- Sidebar pinning or resizing by dragging.
- More than two levels of sidebar navigation nesting.
- Per-user sidebar preferences persisted to a backend.

---

## 6. Design Considerations

- **Styling:** Tailwind CSS with semantic color tokens only (`bg-surface`, `text-primary`, `border-border`, etc.). No hardcoded color utilities.
- **Icons:** Lucide Angular exclusively.
- **Sidebar width:** ~240px expanded, ~64px mini.
- **Transitions:** Sidebar collapse, mobile drawer open/close, and dropdown menus must use smooth CSS transitions (150–300ms).
- **Accessibility:** Interactive controls (hamburger, notifications bell, profile avatar, nav links) must have `aria-label` attributes. Dropdowns must be keyboard-navigable.
- **Angular Material:** Use `MatMenuModule` for the profile dropdown, `MatTooltipModule` for mini-sidebar tooltips, and `MatRippleModule` for nav item click feedback.
- **Layout grid:** The shell uses a CSS flex or grid layout — sidebar on the left, right column contains navbar + `<router-outlet>` stacked vertically.

---

## 7. Technical Considerations

- All components (`AdminLayoutComponent`, `SidebarComponent`, `TopNavbarComponent`, `BreadcrumbComponent`, `NotificationsDropdownComponent`, `ProfileDropdownComponent`, `ThemeSwitcherComponent`) must be **standalone** with **OnPush** change detection.
- Sidebar expanded/mini state must be a `signal<boolean>` on a `LayoutService` (providedIn root or layout-scoped).
- Mobile drawer open state must also be a signal on `LayoutService`.
- The `NAV_ITEMS` config must be a typed constant (`NavItem[]`) in `src/app/core/navigation/nav-items.config.ts`.
- Breadcrumb logic must live in a `BreadcrumbService` that subscribes to the router events and extracts `data.breadcrumb` from the active route tree.
- `NotificationsService` must expose a `notifications` signal and a `markAllRead()` / `markRead(id)` method.
- The layout must integrate with the existing `ThemeService` from the Theme System module — no new localStorage keys.
- The Auth service's `currentUser` signal must be consumed directly; do not duplicate user state.

---

## 8. Success Metrics

- All protected routes render correctly inside the admin layout shell with no visual regressions.
- Sidebar collapses to mini mode and expands back without layout shift on desktop.
- Mobile drawer opens and closes smoothly and closes on outside click.
- Breadcrumbs update correctly on every route navigation.
- Marking all notifications as read clears the unread badge immediately (signal reactivity).
- Theme changes applied via the switcher persist across page reloads.
- All components pass `ng build` with zero TypeScript strict-mode errors.

---

## 9. Open Questions

- Should the search bar open an inline expanded input in the navbar, or a full modal/overlay search experience (for future implementation)?
- Should the `Switch Role (Demo)` action be visible to all users or only when a specific environment flag is set?
- Should the sidebar nav config support route-level permission filtering (hide items the current role cannot access), or is that deferred to a later phase?
- Is there a preferred maximum number of notification items shown in the dropdown before a "View all" link appears?
