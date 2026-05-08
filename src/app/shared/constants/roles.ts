export const ROLES = {
  ADMIN: 'admin',
  AUDITOR: 'auditor',
  AUDITEE: 'auditee',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
