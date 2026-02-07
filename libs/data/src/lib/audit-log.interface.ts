export interface AuditLog {
  id: number;
  userId: number;
  action: string;
  resource: string;
  resourceId: number | null;
  details: string;
  timestamp: Date;
}