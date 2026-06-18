// ========================================================================
// Phase 1 — IndexedDB Data Layer (Dexie.js)
// Maps all 19 Access database tables to browser storage
// ========================================================================
import Dexie, { type Table } from 'dexie';
import type {
  MainPeriod,
  AccessEmployee,
  Movement,
  AppUser,
  AppUserLocal,
  FinancialAdvance,
  Installment,
  LeaveRecord,
  LeaveType,
  Vehicle,
  Violation,
  CompanyData,
  Bank,
  Nationality,
  Religion,
  JobFunction,
  VehicleType,
  LogData,
  LoginLogout,
} from '../types/access-db';

export class HRDatabase extends Dexie {
  // Declare all 19 tables
  mainPeriods!: Table<MainPeriod, string>;
  employees!: Table<AccessEmployee, number>;
  movements!: Table<Movement, number>;
  appUsers!: Table<AppUser, string>;
  appUsersLocal!: Table<AppUserLocal, number>;
  financialAdvances!: Table<FinancialAdvance, number>;
  installments!: Table<Installment, number>;
  leaveRecords!: Table<LeaveRecord, number>;
  leaveTypes!: Table<LeaveType, string>;
  vehicles!: Table<Vehicle, string>;
  violations!: Table<Violation, number>;
  companyData!: Table<CompanyData, number>;
  banks!: Table<Bank, number>;
  nationalities!: Table<Nationality, number>;
  religions!: Table<Religion, string>;
  jobFunctions!: Table<JobFunction, number>;
  vehicleTypes!: Table<VehicleType, number>;
  logData!: Table<LogData, number>;
  loginLogout!: Table<LoginLogout, number>;

  constructor() {
    super('HRAccessDB');
    
    this.version(1).stores({
      mainPeriods: 'dateNo, date, to',
      employees: 'jobNumber, fullName, nationalId, phone, nationality, departmentId, workStatus, *bankId',
      movements: '++id, dateNo, employeeNo',
      appUsers: 'username, fullName',
      appUsersLocal: '++id, username',
      financialAdvances: 'employeeNo',
      installments: '++id, employeeNo, paymentStatus',
      leaveRecords: '++id, employeeNo, leaveType',
      leaveTypes: 'leaveType',
      vehicles: 'plateNumber, vehicleType, licensedUntil, insuranceExpiry',
      violations: '++id, plateNumber, paymentStatus, customerName',
      companyData: '&id',
      banks: 'bankCode',
      nationalities: '++id',
      religions: 'religion',
      jobFunctions: 'departmentId',
      vehicleTypes: '++code',
      logData: '++id',
      loginLogout: '++id',
    });
  }
}

// Singleton instance
export const db = new HRDatabase();

// ========================================================================
// Seed / Import utilities
// ========================================================================

/** Check if the database has been seeded */
export async function isDbSeeded(): Promise<boolean> {
  const count = await db.employees.count();
  return count > 0;
}

/** Seed reference data (banks, nationalities, religions, job functions, leave types) */
export async function seedReferenceData(): Promise<void> {
  // Banks (9 records from Access)
  const bankCount = await db.banks.count();
  if (bankCount === 0) {
    await db.banks.bulkAdd([
      { bankCode: 1, bankName: 'البنك الأهلي' },
      { bankCode: 2, bankName: 'بنك مصر' },
      { bankCode: 3, bankName: 'بنك القاهرة' },
      { bankCode: 4, bankName: 'البنك التجاري الدولي' },
      { bankCode: 5, bankName: 'بنك الإسكندرية' },
      { bankCode: 6, bankName: 'بنك البركة' },
      { bankCode: 7, bankName: 'المصرف المتحد' },
      { bankCode: 8, bankName: 'بنك التعمير والإسكان' },
      { bankCode: 9, bankName: 'بنك أبوظبي الإسلامي' },
    ]);
  }

  // Nationalities
  const natCount = await db.nationalities.count();
  if (natCount === 0) {
    await db.nationalities.bulkAdd([
      { nationality: 'مصري', code: 1 },
      { nationality: 'سعودي', code: 2 },
      { nationality: 'أردني', code: 3 },
      { nationality: 'سوري', code: 4 },
      { nationality: 'فلسطيني', code: 5 },
    ]);
  }

  // Religions
  const relCount = await db.religions.count();
  if (relCount === 0) {
    await db.religions.bulkAdd([
      { religion: 'مسلم' },
      { religion: 'مسيحي' },
    ]);
  }

  // Job Functions (8 records from Access)
  const jobCount = await db.jobFunctions.count();
  if (jobCount === 0) {
    await db.jobFunctions.bulkAdd([
      { departmentId: 1, jobFunctionId: 1, department: 'الإدارة العليا', jobFunction: 'مدير عام' },
      { departmentId: 2, jobFunctionId: 2, department: 'الموارد البشرية', jobFunction: 'مدير موارد بشرية' },
      { departmentId: 2, jobFunctionId: 3, department: 'الموارد البشرية', jobFunction: 'أخصائي موارد بشرية' },
      { departmentId: 3, jobFunctionId: 4, department: 'المالية', jobFunction: 'مدير مالي' },
      { departmentId: 3, jobFunctionId: 5, department: 'المالية', jobFunction: 'محاسب' },
      { departmentId: 4, jobFunctionId: 6, department: 'تقنية المعلومات', jobFunction: 'مدير تقنية' },
      { departmentId: 4, jobFunctionId: 7, department: 'تقنية المعلومات', jobFunction: 'مبرمج' },
      { departmentId: 5, jobFunctionId: 8, department: 'التسويق', jobFunction: 'مسؤول تسويق' },
    ]);
  }

  // Leave Types
  const ltCount = await db.leaveTypes.count();
  if (ltCount === 0) {
    await db.leaveTypes.bulkAdd([
      { leaveType: 'إجازة سنوية', maxDays: 21 },
      { leaveType: 'إجازة مرضية', maxDays: 30 },
      { leaveType: 'إجازة اضطرارية', maxDays: 7 },
      { leaveType: 'إجازة والدية', maxDays: 90 },
      { leaveType: 'إجازة حج', maxDays: 15 },
    ]);
  }

  // Company Data
  const compCount = await db.companyData.count();
  if (compCount === 0) {
    await db.companyData.add({
      id: 1,
      companyName: 'OSAMA AL HALALY',
      address: 'القاهرة، مصر',
    });
  }
}

/** Seed demo employees (5 records from Access + some extensions) */
export async function seedDemoEmployees(): Promise<void> {
  const empCount = await db.employees.count();
  if (empCount > 0) return;

  await db.employees.bulkAdd([
    {
      jobNumber: 1001,
      fullName: 'أحمد محمد علي',
      nationalId: '28001011234567',
      phone: '01234567890',
      currentAddress: 'القاهرة، مدينة نصر',
      nationality: 'مصري',
      maritalStatus: 'متزوج',
      religion: 'مسلم',
      hireDate: new Date('2020-03-15'),
      workStatus: 'Active',
      departmentId: 2,
      hourlyRate: 25,
      workingHours: 8,
      dailyWage: 200,
      insuranceDeduction: 50,
      healthInsuranceDeduction: 30,
      costOfLivingAllowance: 100,
      weeklyDeductions: 20,
    },
    {
      jobNumber: 1002,
      fullName: 'سارة خالد عبدالله',
      nationalId: '28102021234568',
      phone: '01122334455',
      currentAddress: 'الجيزة، الدقي',
      nationality: 'مصري',
      maritalStatus: 'أعزب',
      religion: 'مسلم',
      hireDate: new Date('2021-06-01'),
      workStatus: 'Active',
      departmentId: 3,
      hourlyRate: 30,
      workingHours: 8,
      dailyWage: 240,
      insuranceDeduction: 60,
      healthInsuranceDeduction: 35,
      costOfLivingAllowance: 100,
      weeklyDeductions: 25,
    },
    {
      jobNumber: 1003,
      fullName: 'محمود حسن إبراهيم',
      nationalId: '27909151234569',
      phone: '01099887766',
      currentAddress: 'الإسكندرية، سيدي بشر',
      nationality: 'مصري',
      maritalStatus: 'متزوج',
      religion: 'مسلم',
      hireDate: new Date('2019-11-20'),
      workStatus: 'Active',
      departmentId: 4,
      hourlyRate: 35,
      workingHours: 8,
      dailyWage: 280,
      insuranceDeduction: 70,
      healthInsuranceDeduction: 40,
      costOfLivingAllowance: 150,
      weeklyDeductions: 30,
    },
    {
      jobNumber: 1004,
      fullName: 'نورة أحمد السعيد',
      nationalId: '28203061234570',
      phone: '01556677889',
      currentAddress: 'القاهرة، التجمع الخامس',
      nationality: 'مصري',
      maritalStatus: 'مطلق',
      religion: 'مسلم',
      hireDate: new Date('2022-01-10'),
      workStatus: 'Active',
      departmentId: 5,
      hourlyRate: 28,
      workingHours: 8,
      dailyWage: 224,
      insuranceDeduction: 55,
      healthInsuranceDeduction: 32,
      costOfLivingAllowance: 100,
      weeklyDeductions: 22,
    },
    {
      jobNumber: 1005,
      fullName: 'خالد عمر ناصر',
      nationalId: '27705131234571',
      phone: '01233445566',
      currentAddress: 'القاهرة، المعادي',
      nationality: 'مصري',
      maritalStatus: 'أعزب',
      religion: 'مسلم',
      hireDate: new Date('2018-08-05'),
      workStatus: 'Terminated',
      departmentId: 2,
      hourlyRate: 22,
      workingHours: 8,
      dailyWage: 176,
      insuranceDeduction: 45,
      healthInsuranceDeduction: 28,
      costOfLivingAllowance: 100,
      weeklyDeductions: 18,
    },
  ]);
}

/** Seed demo main periods + movements */
export async function seedDemoMovements(): Promise<void> {
  const periodCount = await db.mainPeriods.count();
  if (periodCount > 0) return;

  // Main periods (4 records)
  await db.mainPeriods.bulkAdd([
    { dateNo: '2026-01', date: new Date('2026-01-01'), to: new Date('2026-01-31'), id: 1 },
    { dateNo: '2026-02', date: new Date('2026-02-01'), to: new Date('2026-02-28'), id: 2 },
    { dateNo: '2026-03', date: new Date('2026-03-01'), to: new Date('2026-03-31'), id: 3 },
    { dateNo: '2026-04', date: new Date('2026-04-01'), to: new Date('2026-04-30'), id: 4 },
  ]);

  // Movements (13 records from Access)
  await db.movements.bulkAdd([
    { dateNo: '2026-01', employeeNo: 1001, days: 22, faction: 0, addHours: 4, aqAss: 0, ammAss: 0, procedure: 0, takafol: 50, aytam: 10 },
    { dateNo: '2026-01', employeeNo: 1002, days: 20, faction: 0, addHours: 0, aqAss: 0, ammAss: 0, procedure: 0, takafol: 60, aytam: 10 },
    { dateNo: '2026-01', employeeNo: 1003, days: 22, faction: 100, addHours: 8, aqAss: 0, ammAss: 0, procedure: 0, takafol: 70, aytam: 10 },
    { dateNo: '2026-01', employeeNo: 1004, days: 18, faction: 0, addHours: 0, aqAss: 0, ammAss: 0, procedure: 0, takafol: 55, aytam: 10 },
    { dateNo: '2026-01', employeeNo: 1005, days: 10, faction: 0, addHours: 0, aqAss: 0, ammAss: 0, procedure: 200, takafol: 45, aytam: 10 },
    { dateNo: '2026-02', employeeNo: 1001, days: 20, faction: 0, addHours: 2, aqAss: 0, ammAss: 0, procedure: 0, takafol: 50, aytam: 10 },
    { dateNo: '2026-02', employeeNo: 1002, days: 22, faction: 0, addHours: 0, aqAss: 0, ammAss: 0, procedure: 0, takafol: 60, aytam: 10 },
    { dateNo: '2026-02', employeeNo: 1003, days: 22, faction: 100, addHours: 6, aqAss: 0, ammAss: 0, procedure: 0, takafol: 70, aytam: 10 },
    { dateNo: '2026-02', employeeNo: 1004, days: 22, faction: 0, addHours: 0, aqAss: 0, ammAss: 0, procedure: 0, takafol: 55, aytam: 10 },
    { dateNo: '2026-03', employeeNo: 1001, days: 22, faction: 0, addHours: 6, aqAss: 0, ammAss: 0, procedure: 0, takafol: 50, aytam: 10 },
    { dateNo: '2026-03', employeeNo: 1002, days: 21, faction: 0, addHours: 0, aqAss: 0, ammAss: 0, procedure: 0, takafol: 60, aytam: 10 },
    { dateNo: '2026-03', employeeNo: 1003, days: 22, faction: 100, addHours: 10, aqAss: 0, ammAss: 0, procedure: 0, takafol: 70, aytam: 10 },
    { dateNo: '2026-03', employeeNo: 1004, days: 20, faction: 0, addHours: 0, aqAss: 0, ammAss: 0, procedure: 0, takafol: 55, aytam: 10 },
  ]);
}

/** Seed demo vehicles */
export async function seedDemoVehicles(): Promise<void> {
  const vehCount = await db.vehicles.count();
  if (vehCount > 0) return;

  await db.vehicles.bulkAdd([
    {
      plateNumber: 'س ص ع 1234',
      vehicleType: 'سيارة ركاب',
      vehicleClass: 'سيدان',
      model: '2022',
      color: 'أبيض',
      engineNumber: 'ENG-1001',
      chassisNumber: 'CHS-1001',
      ownerName: 'شركة OSAMA AL HALALY',
      licensedUntil: new Date('2026-12-31'),
      insuranceExpiry: new Date('2026-09-30'),
      insuranceCompany: 'شركة مصر للتأمين',
      insuranceAmount: 15000,
      price: 450000,
    },
    {
      plateNumber: 'ر ق أ 5678',
      vehicleType: 'سيارة ركاب',
      vehicleClass: 'SUV',
      model: '2023',
      color: 'أسود',
      engineNumber: 'ENG-1002',
      chassisNumber: 'CHS-1002',
      ownerName: 'شركة OSAMA AL HALALY',
      licensedUntil: new Date('2026-11-30'),
      insuranceExpiry: new Date('2026-08-15'),
      insuranceCompany: 'شركة أليانز للتأمين',
      insuranceAmount: 20000,
      price: 650000,
    },
    {
      plateNumber: 'ل و ي 9012',
      vehicleType: 'نقل خفيف',
      vehicleClass: 'فان',
      model: '2021',
      color: 'فضي',
      engineNumber: 'ENG-1003',
      chassisNumber: 'CHS-1003',
      ownerName: 'شركة OSAMA AL HALALY',
      licensedUntil: new Date('2026-06-30'),
      insuranceExpiry: new Date('2026-05-01'),
      insuranceCompany: 'المجموعة المصرية للتأمين',
      insuranceAmount: 12000,
      price: 320000,
    },
  ]);
}

/** Seed demo traffic violations */
export async function seedDemoViolations(): Promise<void> {
  const violCount = await db.violations.count();
  if (violCount > 0) return;

  await db.violations.bulkAdd([
    {
      customerName: 'أحمد محمد',
      plateNumber: 'س ص ع 1234',
      fineAmount: 300,
      violationDate: new Date('2026-03-15'),
      violationTime: new Date('2026-03-15T10:30:00'),
      violationPlace: 'القاهرة - طريق النصر',
      paymentStatus: true,
    },
    {
      customerName: 'خالد علي',
      plateNumber: 'ر ق أ 5678',
      fineAmount: 500,
      violationDate: new Date('2026-04-02'),
      violationTime: new Date('2026-04-02T14:15:00'),
      violationPlace: 'الإسكندرية - طريق الكورنيش',
      paymentStatus: false,
    },
    {
      customerName: 'محمد حسين',
      plateNumber: 'ل و ي 9012',
      fineAmount: 150,
      violationDate: new Date('2026-05-10'),
      violationTime: new Date('2026-05-10T08:45:00'),
      violationPlace: 'الجيزة - محطة الرمل',
      paymentStatus: true,
    },
    {
      customerName: 'أحمد محمد',
      plateNumber: 'س ص ع 1234',
      fineAmount: 250,
      violationDate: new Date('2026-06-01'),
      violationTime: new Date('2026-06-01T16:00:00'),
      violationPlace: 'القاهرة - صلاح سالم',
      paymentStatus: false,
    },
  ]);
}

/** Seed demo leave records */
export async function seedDemoLeaves(): Promise<void> {
  const leaveCount = await db.leaveRecords.count();
  if (leaveCount > 0) return;

  await db.leaveRecords.bulkAdd([
    { employeeNo: 1001, leaveType: 'إجازة سنوية', startDate: new Date('2026-02-01'), daysCount: 10 },
    { employeeNo: 1002, leaveType: 'إجازة مرضية', startDate: new Date('2026-03-10'), daysCount: 3 },
    { employeeNo: 1003, leaveType: 'إجازة حج', startDate: new Date('2026-04-15'), daysCount: 15 },
    { employeeNo: 1004, leaveType: 'إجازة اضطرارية', startDate: new Date('2026-05-05'), daysCount: 2 },
    { employeeNo: 1001, leaveType: 'إجازة سنوية', startDate: new Date('2026-06-01'), daysCount: 7 },
  ]);
}

/** Seed demo local app users */
export async function seedDemoAppUsers(): Promise<void> {
  const userCount = await db.appUsersLocal.count();
  if (userCount > 0) return;

  await db.appUsersLocal.bulkAdd([
    { username: 'admin', password: 'admin123', role: 'مدير النظام', canAdd: true, canDelete: true, canEdit: true },
    { username: 'hrmanager', password: 'hr123', role: 'مدير موارد بشرية', canAdd: true, canDelete: false, canEdit: true },
    { username: 'accountant', password: 'acc123', role: 'محاسب', canAdd: true, canDelete: false, canEdit: true },
    { username: 'viewer', password: 'view123', role: 'مشاهد', canAdd: false, canDelete: false, canEdit: false },
  ]);
}

/** Seed demo financial advances + installments */
export async function seedDemoAdvances(): Promise<void> {
  const advCount = await db.financialAdvances.count();
  if (advCount > 0) return;

  await db.financialAdvances.bulkAdd([
    { employeeNo: 1001, price: 5000, totalPrice: 5000, downPayment: 1000, netPrice: 4000, installmentValue: 500, firstInstallmentDate: new Date('2026-02-01'), installmentCount: 8 },
    { employeeNo: 1003, price: 10000, totalPrice: 10000, downPayment: 2000, netPrice: 8000, installmentValue: 800, firstInstallmentDate: new Date('2026-01-15'), installmentCount: 10 },
    { employeeNo: 1004, price: 3000, totalPrice: 3000, downPayment: 500, netPrice: 2500, installmentValue: 300, firstInstallmentDate: new Date('2026-03-01'), installmentCount: 8 },
    { employeeNo: 1002, price: 2000, totalPrice: 2000, downPayment: 0, netPrice: 2000, installmentValue: 400, firstInstallmentDate: new Date('2026-02-15'), installmentCount: 5 },
  ]);

  // Installments (25 records)
  await db.installments.bulkAdd([
    { employeeNo: 1001, paymentDate: new Date('2026-02-01'), amount: 500, paymentStatus: 'Paid' },
    { employeeNo: 1001, paymentDate: new Date('2026-03-01'), amount: 500, paymentStatus: 'Paid' },
    { employeeNo: 1001, paymentDate: new Date('2026-04-01'), amount: 500, paymentStatus: 'Paid' },
    { employeeNo: 1001, paymentDate: new Date('2026-05-01'), amount: 500, paymentStatus: 'Pending' },
    { employeeNo: 1001, paymentDate: new Date('2026-06-01'), amount: 500, paymentStatus: 'Pending' },
    { employeeNo: 1001, paymentDate: new Date('2026-07-01'), amount: 500, paymentStatus: 'Pending' },
    { employeeNo: 1001, paymentDate: new Date('2026-08-01'), amount: 500, paymentStatus: 'Pending' },
    { employeeNo: 1001, paymentDate: new Date('2026-09-01'), amount: 500, paymentStatus: 'Pending' },
    { employeeNo: 1003, paymentDate: new Date('2026-01-15'), amount: 800, paymentStatus: 'Paid' },
    { employeeNo: 1003, paymentDate: new Date('2026-02-15'), amount: 800, paymentStatus: 'Paid' },
    { employeeNo: 1003, paymentDate: new Date('2026-03-15'), amount: 800, paymentStatus: 'Paid' },
    { employeeNo: 1003, paymentDate: new Date('2026-04-15'), amount: 800, paymentStatus: 'Paid' },
    { employeeNo: 1003, paymentDate: new Date('2026-05-15'), amount: 800, paymentStatus: 'Pending' },
    { employeeNo: 1003, paymentDate: new Date('2026-06-15'), amount: 800, paymentStatus: 'Pending' },
    { employeeNo: 1003, paymentDate: new Date('2026-07-15'), amount: 800, paymentStatus: 'Pending' },
    { employeeNo: 1003, paymentDate: new Date('2026-08-15'), amount: 800, paymentStatus: 'Pending' },
    { employeeNo: 1003, paymentDate: new Date('2026-09-15'), amount: 800, paymentStatus: 'Pending' },
    { employeeNo: 1003, paymentDate: new Date('2026-10-15'), amount: 800, paymentStatus: 'Pending' },
    { employeeNo: 1004, paymentDate: new Date('2026-03-01'), amount: 300, paymentStatus: 'Paid' },
    { employeeNo: 1004, paymentDate: new Date('2026-04-01'), amount: 300, paymentStatus: 'Paid' },
    { employeeNo: 1004, paymentDate: new Date('2026-05-01'), amount: 300, paymentStatus: 'Paid' },
    { employeeNo: 1004, paymentDate: new Date('2026-06-01'), amount: 300, paymentStatus: 'Pending' },
    { employeeNo: 1002, paymentDate: new Date('2026-02-15'), amount: 400, paymentStatus: 'Paid' },
    { employeeNo: 1002, paymentDate: new Date('2026-03-15'), amount: 400, paymentStatus: 'Paid' },
    { employeeNo: 1002, paymentDate: new Date('2026-04-15'), amount: 400, paymentStatus: 'Pending' },
  ]);
}

/** Master seed function */
export async function seedDatabase(): Promise<void> {
  await seedReferenceData();
  await seedDemoEmployees();
  await seedDemoMovements();
  await seedDemoAdvances();
  await seedDemoVehicles();
  await seedDemoViolations();
  await seedDemoLeaves();
  await seedDemoAppUsers();
}

// ========================================================================
// Salary Computation Utility
// ========================================================================

/** Compute monthly salary using Access formulas */
export function computeSalary(
  employee: AccessEmployee,
  movement: Movement,
): {
  empTotalSalary: number;
  contSalary: number;
  netPay: number;
  allowancesTotal: number;
  deductionsTotal: number;
} {
  const dailyWage = employee.dailyWage || 0;
  const days = movement.days || 0;
  const addHours = movement.addHours || 0;
  const weeklyDeductions = employee.weeklyDeductions || 0;
  const procedure = movement.procedure || 0;
  const faction = movement.faction || 0;
  const aqAss = movement.aqAss || 0;
  const ammAss = movement.ammAss || 0;
  const takafol = movement.takafol || 0;
  const aytam = movement.aytam || 0;
  const insuranceDed = employee.insuranceDeduction || 0;
  const healthInsDed = employee.healthInsuranceDeduction || 0;

  // Formula from Access all-inq_1: [daily_wage] + [DAYS] - [PROCEDURE] + [weekly_deductions]
  const empTotalSalary = dailyWage + days - procedure + weeklyDeductions;

  // Formula from Access mov_form: ([dailyWage]) * ([DAYS] + ([ADD_HOURS]/8)) - [weeklyDeductions] - [PROCEDURE]
  const contSalary = dailyWage * (days + (addHours / 8)) - weeklyDeductions - procedure;

  // Total allowances
  const allowancesTotal = faction + aqAss + ammAss + (employee.costOfLivingAllowance || 0);

  // Total deductions
  const deductionsTotal = takafol + aytam + insuranceDed + healthInsDed;

  // Net pay
  const netPay = contSalary + allowancesTotal - deductionsTotal;

  return {
    empTotalSalary: Math.max(0, Math.round(empTotalSalary * 100) / 100),
    contSalary: Math.max(0, Math.round(contSalary * 100) / 100),
    netPay: Math.max(0, Math.round(netPay * 100) / 100),
    allowancesTotal,
    deductionsTotal,
  };
}