import { Injectable, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly breadcrumbs = signal<Breadcrumb[]>([]);

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs.set(this.buildBreadcrumbs(this.activatedRoute.root));
      });
  }

  private buildBreadcrumbs(route: ActivatedRoute, url = '', crumbs: Breadcrumb[] = []): Breadcrumb[] {
    const children = route.children;

    for (const child of children) {
      const segments = child.snapshot.url.map(s => s.path);
      const path = segments.length ? `${url}/${segments.join('/')}` : url;
      const label = child.snapshot.data['breadcrumb'] as string | undefined;

      if (label) {
        crumbs.push({ label, url: path });
      }

      this.buildBreadcrumbs(child, path, crumbs);
    }

    return crumbs;
  }
}
