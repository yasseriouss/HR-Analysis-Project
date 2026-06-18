export type ContractType = 'fixed-term' | 'unlimited' | 'part-time' | 'probation';
export type ContractStatus = 'active' | 'expired' | 'renewed' | 'terminated' | 'pending-renewal';

export interface Contract {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  jobRole: string;
  contractType: ContractType;
  status: ContractStatus;
  startDate: string;       // YYYY-MM-DD
  endDate?: string;        // YYYY-MM-DD (null for unlimited)
  probationEndDate?: string;
  renewalCount: number;
  lastRenewalDate?: string;
  salary: number;
  notes?: string;
}

export const CONTRACT_TYPE_LABELS: Record<ContractType, { en: string; ar: string }> = {
  'fixed-term': { en: 'Fixed-Term', ar: 'عقد محدد المدة' },
  'unlimited': { en: 'Unlimited', ar: 'عقد غير محدد المدة' },
  'part-time': { en: 'Part-Time', ar: 'دوام جزئي' },
  'probation': { en: 'Probation', ar: 'فترة تجربة' },
};

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, { en: string; ar: string }> = {
  'active': { en: 'Active', ar: 'نشط' },
  'expired': { en: 'Expired', ar: 'منتهي' },
  'renewed': { en: 'Renewed', ar: 'مُجدَّد' },
  'terminated': { en: 'Terminated', ar: 'منهي' },
  'pending-renewal': { en: 'Pending Renewal', ar: 'بانتظار التجديد' },
};