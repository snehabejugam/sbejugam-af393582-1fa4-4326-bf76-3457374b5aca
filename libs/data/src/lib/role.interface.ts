export enum RoleType {
  OWNER = 'Owner',
  ADMIN = 'Admin',
  VIEWER = 'Viewer'
}

export interface Role {
  id: number;
  name: RoleType;
  createdAt: Date;
  updatedAt: Date;
}