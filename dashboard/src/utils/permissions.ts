export type UserRole = 'admin' | 'hr' | 'manager' | 'employee';

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

export const PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'view_analytics', 'manage_employees', 'manage_payroll', 'manage_attendance',
    'manage_leaves', 'manage_vehicles', 'manage_violations', 'manage_users',
    'approve_expenses', 'predict_attrition', 'edit_contracts', 'run_reports'
  ],
  hr: [
    'view_analytics', 'manage_employees', 'manage_payroll', 'manage_attendance',
    'manage_leaves', 'approve_expenses', 'predict_attrition', 'edit_contracts', 'run_reports'
  ],
  manager: [
    'view_analytics', 'manage_attendance', 'manage_leaves',
    'approve_expenses', 'run_reports'
  ],
  employee: [
    'view_analytics'
  ]
};

export const hasPermission = (role: UserRole, permission: Permission): boolean => {
  return PERMISSIONS[role]?.includes(permission) ?? false;
};

export const getRoleFromLocal = (): UserRole => {
  try {
    const cached = localStorage.getItem('hr_pulse_role');
    if (cached === 'admin' || cached === 'hr' || cached === 'manager' || cached === 'employee') {
      return cached as UserRole;
    }
  } catch (e) {
    console.error('Failed to load role from cache', e);
  }
  return 'admin';
};

export const saveRoleToLocal = (role: UserRole) => {
  try {
    localStorage.setItem('hr_pulse_role', role);
  } catch (e) {
    console.error('Failed to save role to cache', e);
  }
};