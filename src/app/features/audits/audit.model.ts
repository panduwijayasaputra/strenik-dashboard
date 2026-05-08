import { BaseModel } from '../../shared/models/base.model';

export type AuditStatus = 'draft' | 'in_progress' | 'completed' | 'cancelled';

export interface Audit extends BaseModel {
  title: string;
  description: string;
  status: AuditStatus;
  organizationId: string;
  templateId?: string;
  assignedAuditorId?: string;
}
