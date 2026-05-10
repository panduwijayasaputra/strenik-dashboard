import { BaseModel } from '../../shared/models/base.model';

export interface ActivityLog extends BaseModel {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}
