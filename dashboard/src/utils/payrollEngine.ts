import type { PayrollRecord, PayrollSummary, PayrollConfig } from '../types/payroll';
import { EGYPTIAN_TAX_BRACKETS, SOCIAL_INSURANCE_RATES, MARTYRS_TAX_RATE } from '../types/payroll';
import type { Employee } from '../types/employee';

// Default payroll configuration
export const DEFAULT_PAYROLL_CONFIG: PayrollConfig = {
  currency: 'EGP',
  exchangeRate: 50.5, // Approximate EGP/USD
  includeMartyrsTax: true,
  taxExemptAllowance: 20000, // Annual personal exemption
};

/**
 * Calculate Egyptian income tax based on annual taxable income
 */
export function calculateIncomeTax(annualTaxableIncome: number): number {
  let remainingIncome = annualTaxableIncome;
  let totalTax = 0;

  for (const bracket of EGYPTIAN_TAX_BRACKETS) {
    if (remainingIncome <= 0) break;

    const bracketWidth = bracket.max - bracket.min;
    const taxableInBracket = Math.min(remainingIncome, bracketWidth);
    totalTax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }

  return Math.round(totalTax / 12); // Monthly tax
}

/**
 * Calculate social insurance deductions
 */
export function calculateSocialInsurance(monthlyInsurableSalary: number): {
  employeeContribution: number;
  employerContribution: number;
} {
  // Clamp salary within insurance bounds
  const clampedSalary = Math.max(
    SOCIAL_INSURANCE_RATES.minInsuranceSalary,
    Math.min(monthlyInsurableSalary, SOCIAL_INSURANCE_RATES.maxInsuranceSalary)
  );

  const employeeContribution = Math.round(
    clampedSalary * SOCIAL_INSURANCE_RATES.employee.pension
  );

  const employerContribution = Math.round(
    clampedSalary * (
      SOCIAL_INSURANCE_RATES.employer.pension +
      SOCIAL_INSURANCE_RATES.employer.socialInsurance +
      SOCIAL_INSURANCE_RATES.employer.laborFund
    )
  );

  return { employeeContribution, employerContribution };
}

/**
 * Calculate Martyrs Tax (1% of annual income for employees > 1M EGP)
 */
export function calculateMartyrsTax(annualGrossSalary: number, includeTax: boolean): number {
  if (!includeTax || annualGrossSalary <= 1000000) return 0;
  return Math.round((annualGrossSalary * MARTYRS_TAX_RATE) / 12);
}

/**
 * Generate a payroll record for an employee
 */
export function generatePayrollRecord(
  employee: Employee,
  period: string,
  config: PayrollConfig = DEFAULT_PAYROLL_CONFIG
): PayrollRecord {
  const basicSalary = Math.round(employee.MonthlyIncome * 0.6);
  const housingAllowance = Math.round(employee.MonthlyIncome * 0.2);
  const transportAllowance = Math.round(employee.MonthlyIncome * 0.1);
  const socialAllowance = Math.round(employee.MonthlyIncome * 0.05);
  const otherAllowances = employee.MonthlyIncome - basicSalary - housingAllowance - transportAllowance - socialAllowance;
  const overtimePay = employee.OverTime === 'Yes' ? Math.round(basicSalary * 0.25) : 0;
  const bonusPay = Math.round(employee.PercentSalaryHike * employee.MonthlyIncome / 100 / 12);

  const grossSalary = basicSalary + housingAllowance + transportAllowance + socialAllowance + otherAllowances + overtimePay + bonusPay;

  // Tax calculation
  const annualGross = grossSalary * 12;
  const annualExempt = config.taxExemptAllowance;
  const annualTaxable = Math.max(0, annualExempt > 0 ? annualGross - annualExempt : annualGross);
  const incomeTax = calculateIncomeTax(annualTaxable);

  // Social Insurance
  const { employeeContribution: socialInsuranceEmployee, employerContribution: socialInsuranceEmployer } = 
    calculateSocialInsurance(basicSalary + housingAllowance);

  // Martyrs Tax
  const martyrsTax = calculateMartyrsTax(annualGross, config.includeMartyrsTax);

  // Other deductions
  const insuranceDeduction = Math.round(basicSalary * 0.01); // Health insurance
  const advancesDeduction = 0; // Would come from advances data
  const otherDeductions = 0;

  const totalDeductions = incomeTax + socialInsuranceEmployee + martyrsTax + insuranceDeduction + advancesDeduction + otherDeductions;
  const netSalary = grossSalary - totalDeductions;
  const totalEmployerCost = grossSalary + socialInsuranceEmployer;

  return {
    id: `PAY-${employee.EmpID}-${period}`,
    employeeId: employee.EmpID,
    employeeName: `${employee.Gender === 'Male' ? 'Mr.' : 'Ms.'} Employee #${employee.EmployeeNumber}`,
    department: employee.Department,
    jobRole: employee.JobRole,
    period,
    basicSalary,
    housingAllowance,
    transportAllowance,
    socialAllowance,
    otherAllowances: Math.max(0, otherAllowances),
    overtimePay,
    bonusPay,
    grossSalary,
    incomeTax,
    socialInsuranceEmployee,
    martyrsTax,
    insuranceDeduction,
    advancesDeduction,
    otherDeductions,
    totalDeductions,
    netSalary,
    socialInsuranceEmployer,
    totalEmployerCost,
    status: 'draft',
  };
}

/**
 * Generate payroll for all employees in a given period
 */
export function generatePayrollBatch(
  employees: Employee[],
  period: string,
  config: PayrollConfig = DEFAULT_PAYROLL_CONFIG
): PayrollRecord[] {
  return employees.map(emp => generatePayrollRecord(emp, period, config));
}

/**
 * Calculate payroll summary statistics
 */
export function calculatePayrollSummary(records: PayrollRecord[]): PayrollSummary {
  if (records.length === 0) {
    return {
      period: '',
      totalEmployees: 0,
      totalGrossSalary: 0,
      totalDeductions: 0,
      totalNetSalary: 0,
      totalEmployerCost: 0,
      totalIncomeTax: 0,
      totalSocialInsurance: 0,
      totalMartyrsTax: 0,
      averageNetSalary: 0,
      highestNetSalary: 0,
      lowestNetSalary: 0,
    };
  }

  const totals = records.reduce(
    (acc, rec) => ({
      gross: acc.gross + rec.grossSalary,
      deductions: acc.deductions + rec.totalDeductions,
      net: acc.net + rec.netSalary,
      employerCost: acc.employerCost + rec.totalEmployerCost,
      incomeTax: acc.incomeTax + rec.incomeTax,
      socialInsurance: acc.socialInsurance + rec.socialInsuranceEmployee,
      martyrsTax: acc.martyrsTax + rec.martyrsTax,
      nets: [...acc.nets, rec.netSalary],
    }),
    { gross: 0, deductions: 0, net: 0, employerCost: 0, incomeTax: 0, socialInsurance: 0, martyrsTax: 0, nets: [] as number[] }
  );

  const sortedNets = totals.nets.sort((a, b) => a - b);

  return {
    period: records[0]?.period || '',
    totalEmployees: records.length,
    totalGrossSalary: totals.gross,
    totalDeductions: totals.deductions,
    totalNetSalary: totals.net,
    totalEmployerCost: totals.employerCost,
    totalIncomeTax: totals.incomeTax,
    totalSocialInsurance: totals.socialInsurance,
    totalMartyrsTax: totals.martyrsTax,
    averageNetSalary: Math.round(totals.net / records.length),
    highestNetSalary: sortedNets[sortedNets.length - 1] || 0,
    lowestNetSalary: sortedNets[0] || 0,
  };
}

/**
 * Format currency value
 */
export function formatCurrency(value: number, lang: 'en' | 'ar' = 'en'): string {
  if (lang === 'ar') {
    return `${value.toLocaleString('ar-EG')} ج.م`;
  }
  return `EGP ${value.toLocaleString('en-US')}`;
}