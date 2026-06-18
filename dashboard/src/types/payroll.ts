// Egyptian Tax Brackets (2024/2025 progressive)
export const EGYPTIAN_TAX_BRACKETS = [
  { min: 0, max: 40000, rate: 0 },
  { min: 40000, max: 55000, rate: 0.10 },
  { min: 55000, max: 70000, rate: 0.15 },
  { min: 70000, max: 200000, rate: 0.20 },
  { min: 200000, max: 400000, rate: 0.225 },
  { min: 400000, max: 600000, rate: 0.25 },
  { min: 600000, max: 700000, rate: 0.275 },
  { min: 700000, max: Infinity, rate: 0.275 },
];

// Social Insurance Rates (Egypt)
export const SOCIAL_INSURANCE_RATES = {
  employer: {
    pension: 0.1875,       // 18.75%
    socialInsurance: 0.11, // 11%
    laborFund: 0.00,       // Labor reform fund
  },
  employee: {
    pension: 0.11,         // 11%
    socialInsurance: 0.00, // Covered by employer
  },
  // Caps
  minInsuranceSalary: 7000,
  maxInsuranceSalary: 12600, // Subject to change annually
  insuranceThreshold: 8000,  // Above this, additional contributions apply
};

// Martyrs Tax Rate
export const MARTYRS_TAX_RATE = 0.01; // 1%

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  jobRole: string;
  period: string; // YYYY-MM
  // Earnings
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  socialAllowance: number;
  otherAllowances: number;
  overtimePay: number;
  bonusPay: number;
  grossSalary: number;
  // Deductions
  incomeTax: number;
  socialInsuranceEmployee: number;
  martyrsTax: number;
  insuranceDeduction: number;
  advancesDeduction: number;
  otherDeductions: number;
  totalDeductions: number;
  // Net
  netSalary: number;
  // Employer Costs
  socialInsuranceEmployer: number;
  totalEmployerCost: number;
  // Status
  status: 'draft' | 'processed' | 'paid' | 'reconciled';
  processedDate?: string;
  paidDate?: string;
}

export interface PayrollSummary {
  period: string;
  totalEmployees: number;
  totalGrossSalary: number;
  totalDeductions: number;
  totalNetSalary: number;
  totalEmployerCost: number;
  totalIncomeTax: number;
  totalSocialInsurance: number;
  totalMartyrsTax: number;
  averageNetSalary: number;
  highestNetSalary: number;
  lowestNetSalary: number;
}

export interface PayrollConfig {
  currency: 'EGP' | 'USD';
  exchangeRate: number; // USD to EGP
  includeMartyrsTax: boolean;
  taxExemptAllowance: number; // Personal exemption
}