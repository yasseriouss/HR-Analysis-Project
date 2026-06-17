import React from 'react';
import { hasPermission, getRoleFromLocal } from '../utils/permissions';

interface PermissionGuardProps {
  permission: 'view_analytics' | 'manage_employees' | 'manage_payroll' | 'manage_attendance' | 'manage_leaves' | 'manage_vehicles' | 'manage_violations' | 'manage_users' | 'approve_expenses' | 'predict_attrition' | 'edit_contracts' | 'run_reports';
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const withPermission: React.FC<PermissionGuardProps> = ({ permission, fallback = null, children }) => {
  const role = getRoleFromLocal();
  if (!hasPermission(role, permission)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
};