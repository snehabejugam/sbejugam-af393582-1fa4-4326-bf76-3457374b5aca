import { Injectable } from '@nestjs/common';

export interface UserPermissions {
  id: number;
  email: string;
  roleId: number;
  organizationId: number;
  role: {
    name: string;
  };
}

@Injectable()
export class PermissionService {
  /**
   * Check if user can create resources
   */
  canCreate(user: UserPermissions): boolean {
    return ['Owner', 'Admin'].includes(user.role?.name);
  }

  /**
   * Check if user can edit resources
   */
  canEdit(user: UserPermissions, resourceCreatorId?: number): boolean {
    const roleName = user.role?.name;
    
    // Owners and Admins can edit
    if (['Owner', 'Admin'].includes(roleName)) {
      return true;
    }
    
    // Viewers cannot edit
    return false;
  }

  /**
   * Check if user can delete resources
   */
  canDelete(user: UserPermissions, resourceCreatorId?: number): boolean {
    const roleName = user.role?.name;
    
    // Only Owners and Admins can delete
    if (['Owner', 'Admin'].includes(roleName)) {
      return true;
    }
    
    return false;
  }

  /**
   * Check if user can view audit logs
   */
  canViewAuditLog(user: UserPermissions): boolean {
    return ['Owner', 'Admin'].includes(user.role?.name);
  }

  /**
   * Check if user has access to organization
   */
  canAccessOrganization(user: UserPermissions, targetOrgId: number, childOrgIds: number[] = []): boolean {
    // User can access their own organization
    if (user.organizationId === targetOrgId) {
      return true;
    }

    // Owners can access child organizations
    if (user.role?.name === 'Owner' && childOrgIds.includes(targetOrgId)) {
      return true;
    }

    return false;
  }

  /**
   * Get permission summary for a user
   */
  getPermissionSummary(user: UserPermissions) {
    return {
      canCreate: this.canCreate(user),
      canEdit: this.canEdit(user),
      canDelete: this.canDelete(user),
      canViewAuditLog: this.canViewAuditLog(user),
      role: user.role?.name,
    };
  }
}