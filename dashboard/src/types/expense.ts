export type ExpenseStatus = 'pending' | 'approved' | 'rejected' | 'reimbursed';
export type ExpenseCategory = 'travel' | 'meals' | 'equipment' | 'training' | 'transport' | 'other';

export interface ExpenseClaim {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  status: ExpenseStatus;
  submittedDate: string;
  approvedDate?: string;
  approvedBy?: string;
  receiptUrl?: string;
  notes?: string;
}

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, { en: string; ar: string; icon: string }> = {
  travel: { en: 'Travel', ar: 'سفر', icon: '✈️' },
  meals: { en: 'Meals', ar: 'وجبات', icon: '🍽️' },
  equipment: { en: 'Equipment', ar: 'معدات', icon: '💻' },
  training: { en: 'Training', ar: 'تدريب', icon: '📚' },
  transport: { en: 'Transport', ar: 'نقل', icon: '🚗' },
  other: { en: 'Other', ar: 'أخرى', icon: '📋' },
};

export const EXPENSE_STATUS_LABELS: Record<ExpenseStatus, { en: string; ar: string; color: string }> = {
  pending: { en: 'Pending', ar: 'معلق', color: '#F59E0B' },
  approved: { en: 'Approved', ar: 'معتمد', color: '#10B981' },
  rejected: { en: 'Rejected', ar: 'مرفوض', color: '#EF4444' },
  reimbursed: { en: 'Reimbursed', ar: 'مُسدد', color: '#8B5CF6' },
};