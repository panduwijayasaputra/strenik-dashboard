import { BaseModel } from './base.model';

export interface Organization extends BaseModel {
  name: string;
  slug: string;
  tokenLimit: number;
}
