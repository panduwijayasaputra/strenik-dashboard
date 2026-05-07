# Angular Dashboard Template Project Guideline

> Internal engineering guideline for Claude AI-assisted development.

---

# Project Overview

This project is a reusable enterprise-grade dashboard template that will become the foundation for all future web applications.

The system must be:

- scalable
- reusable
- maintainable
- modern
- AI-friendly
- component-driven
- enterprise-ready

The architecture must prioritize:

- clean code
- reusable abstractions
- performance
- developer experience
- strong typing
- future scalability

---

# Core Stack

## Frontend Framework

- Angular latest stable version
- Standalone Components
- Angular Signals
- Strict TypeScript

---

# Styling

## CSS Framework

- Tailwind CSS

Requirements:

- use semantic color tokens
- avoid hardcoded Tailwind colors
- fully themeable architecture
- responsive-first approach

DO NOT:

```html
bg-blue-500
text-red-500
```

PREFER:

```html
bg-primary
text-danger
```

---

# UI Components

## Primary UI Library

Use:

- Angular Material

For:

- dialogs
- overlays
- date picker
- table
- tooltip
- menu
- tabs
- accessibility

Use Tailwind for:

- layout
- spacing
- dashboard styling
- responsiveness
- visual customization

---

# Icon System

Use:

- Lucide Angular

---

# Notification System

Use:

- ngx-toastr

---

# Charts

Use:

- ng-apexcharts

---

# Architecture Rules

# IMPORTANT

This project MUST follow reusable enterprise architecture.

Avoid:

- duplicated logic
- feature coupling
- hardcoded UI
- giant components
- giant services
- business logic inside templates

Prefer:

- composition
- reusable UI
- generic infrastructure
- typed models
- isolated features
- reusable directives
- reusable pipes

---

# Folder Structure

```txt
src/
 ├── app/
 │    ├── core/
 │    │    ├── api/
 │    │    ├── auth/
 │    │    ├── guards/
 │    │    ├── interceptors/
 │    │    ├── layouts/
 │    │    ├── services/
 │    │    ├── theme/
 │    │    └── utils/
 │    │
 │    ├── shared/
 │    │    ├── components/
 │    │    ├── directives/
 │    │    ├── models/
 │    │    ├── pipes/
 │    │    ├── ui/
 │    │    └── types/
 │    │
 │    ├── features/
 │    │    ├── dashboard/
 │    │    ├── auth/
 │    │    ├── users/
 │    │    ├── settings/
 │    │    └── profile/
 │    │
 │    ├── app.routes.ts
 │    └── app.config.ts
 │
 ├── assets/
 ├── environments/
 └── styles/
```

---

# Component Standards

# General Rules

All components should:

- use standalone components
- use OnPush strategy when applicable
- use Signals for local state
- avoid unnecessary RxJS complexity
- use strongly typed inputs/outputs
- be reusable
- support dark mode
- support theme system
- support responsive layout

---

# UI Components Checklist

The template MUST include reusable components for:

## Forms

- text input
- email input
- password input
- number input
- textarea
- radio
- checkbox
- select
- multi select
- autocomplete
- date picker
- time picker
- color picker
- file upload
- image upload preview
- drag drop upload
- tags input
- WYSIWYG editor

---

## Feedback Components

- alert
- toast
- modal
- tooltip
- popover
- spinner
- skeleton loader
- progress bar

---

## Navigation Components

- sidebar
- top navbar
- breadcrumb
- tabs
- dropdown
- pagination

---

## Display Components

- cards
- avatar
- badge
- table
- list
- image
- chart widgets
- stat widgets

---

# Table Requirements

Every reusable table component MUST support:

- sorting
- filtering
- pagination
- loading state
- empty state
- row actions
- row selection
- bulk actions
- server-side support
- responsive behavior

Optional:

- column visibility
- sticky header
- export CSV
- export Excel

---

# Theme System

The application MUST support:

- light mode
- dark mode
- system mode
- multiple color themes

Example themes:

- blue
- emerald
- violet
- amber
- slate

---

# Theme Architecture

Use:

- CSS variables
- Tailwind semantic colors
- runtime theme switching

DO NOT use hardcoded color utilities.

---

# Theme Storage

Persist:

- appearance mode
- selected theme

Using:

- localStorage

---

# Theme Selector

Must include:

- light/dark toggle
- system mode
- theme color selector
- live preview

---

# Layout Requirements

# Admin Layout

Must contain:

- sidebar
- top navbar
- notifications
- profile dropdown
- breadcrumbs
- theme switcher

---

# Auth Layout

Pages:

- login
- register
- forgot password
- reset password

---

# Blank Layout

Used for:

- landing pages
- public pages
- error pages

---

# Sidebar Requirements

Sidebar must support:

- collapsible mode
- nested menu
- active states
- mobile responsive
- mini sidebar
- role-based visibility
- icons

---

# Authentication Structure

Prepare architecture for:

- JWT auth
- refresh token
- role permissions
- route guards
- permission directives

Even if not fully implemented initially.

---

# Permission Directive Example

```html
<button *hasPermission="'users.create'">
  Add User
</button>
```

---

# State Management

Use:

- Angular Signals

Avoid adding NgRx unless truly necessary.

---

# API Architecture

Create reusable API infrastructure.

Requirements:

- HTTP interceptors
- auth interceptor
- error interceptor
- typed DTOs
- environment configuration
- centralized API services

---

# Form Standards

Use:

- Reactive Forms

Requirements:

- reusable validators
- reusable form wrappers
- reusable error display
- loading state
- disabled state
- accessibility support

---

# Responsive Design Rules

The system MUST be:

- mobile responsive
- tablet responsive
- desktop optimized

Use:

- Tailwind responsive utilities

---

# Accessibility Requirements

All components should:

- support keyboard navigation
- support screen readers
- use semantic HTML
- include aria labels where needed

---

# Performance Requirements

Prefer:

- lazy loading
- route-level code splitting
- standalone imports
- signal-based local state
- optimized change detection

Avoid:

- unnecessary subscriptions
- excessive re-rendering
- giant shared modules

---

# Code Style Rules

# Naming

## Components

```txt
user-table.component.ts
```

## Services

```txt
user.service.ts
```

## Signals Store

```txt
theme.store.ts
```

---

# Component Design Philosophy

Prefer:

- small reusable components
- generic abstractions
- configurable inputs

Avoid:

- feature-specific reusable components

---

# Reusable Infrastructure

Build reusable:

- base table
- base modal
- base form field
- base CRUD page
- base API service
- base confirmation dialog

---

# Error Pages

Create:

- 401
- 403
- 404
- 500

---

# Example Feature Pages

Create demo pages for:

- dashboard
- users CRUD
- products CRUD
- settings
- profile

---

# Dashboard Requirements

Dashboard should contain:

- stat cards
- charts
- activity feed
- recent table data
- responsive widgets

---

# Development Tooling

Use:

- ESLint
- Prettier
- Husky
- lint-staged

---

# Testing

Use:

- Vitest
- Cypress

---

# Git Standards

Use conventional commits.

Example:

```txt
feat: add reusable data table component
fix: resolve dark mode sidebar flicker
refactor: simplify theme service
```

---

# Claude AI Development Rules

# IMPORTANT

Claude should:

- generate reusable code
- avoid duplication
- use standalone components
- use Angular Signals
- follow strict typing
- follow project architecture
- generate scalable abstractions
- avoid unnecessary complexity

---

# Claude Prompting Rules

When generating code:

- always specify Angular version compatibility
- always request standalone components
- always request Tailwind-compatible styling
- always request accessibility support
- always request responsive behavior
- always request dark mode support
- always request strong typing

---

# Example Claude Prompt

```txt
Create a reusable Angular standalone data table component.

Requirements:
- Angular latest stable version
- Tailwind CSS styling
- Angular Material table
- sorting
- filtering
- pagination
- row selection
- loading skeleton
- empty state
- responsive layout
- dark mode support
- strongly typed generic rows
- Signals-based state management
- reusable architecture
```

---

# Long-Term Goal

This template should become:

- reusable internal framework
- SaaS starter template
- enterprise dashboard foundation
- multi-project UI system

The project should prioritize:

- scalability
- maintainability
- speed of development
- consistency
- AI-assisted productivity

---

# Final Technical Direction

Preferred stack:

- Angular latest stable
- Standalone Components
- Angular Signals
- Tailwind CSS
- Angular Material
- Lucide Icons
- ngx-toastr
- ng-apexcharts
- Reactive Forms
- Strict TypeScript

This stack is the official project standard.

