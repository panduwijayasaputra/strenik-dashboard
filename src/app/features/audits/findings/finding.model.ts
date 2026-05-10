import { BaseModel } from '../../../shared/models/base.model';

export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low';
export type FindingStatus = 'open' | 'in_remediation' | 'resolved' | 'verified';

export interface Finding extends BaseModel {
  auditId: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  status: FindingStatus;
}
