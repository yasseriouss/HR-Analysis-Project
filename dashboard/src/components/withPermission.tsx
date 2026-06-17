import React from 'react';
import { hasPermission, getRoleFromLocal } from '../utils/permissions';

export type Permission =
  | 'view_analytics'
  | 'manage_employees'
  | 'manage_payroll'
  | 'manage_attendance'
  | 'manage_leaves'
  | 'manage_vehicles'
  | 'manage_violations'
  | 'manage_users'
  | 'approve_expenses'
  | 'predict_attrition'
  | 'edit_contracts'
  | 'run_reports';

export interface PermissionGuardProps {
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function withPermission({ permission, fallback = null, children }: PermissionGuardProps): React.ReactElement | null {
  const role = getRoleFromLocal();
  if (!hasPermission(role, permission)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}
