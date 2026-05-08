import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Organization } from '../models/organization.model';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  getAll(): Observable<Organization[]> {
    return of([]);
  }

  getById(id: string): Observable<Organization> {
    return of({ id, name: 'Mock Org', slug: 'mock-org', tokenLimit: 1000, createdAt: '', updatedAt: '' });
  }
}
