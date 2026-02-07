export interface Organization {
  id: number;
  name: string;
  parentOrganizationId: number | null; // null for top-level orgs
  createdAt: Date;
  updatedAt: Date;
}