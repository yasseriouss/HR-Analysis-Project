// ========================================================================
// Phase 1 — Full Access Database Type Definitions (19 Tables)
// ========================================================================
// These types map to the "secondbrain-HR.accdb" tables
// ========================================================================

// -------------------- 1. MAIN (Date Periods) --------------------
export interface MainPeriod {
  dateNo: string;       // PK, Text(50) — e.g. "2026-01"
  date?: Date;          // Start date
  to?: Date;            // End date
  id?: number;          // AutoNumber
}

// -------------------- 2. EMPLOYEES (الموظفين) — 34 fields --------------------
export interface AccessEmployee {
  jobNumber: number;            // رقم الوظيفي — PK, Long
  barcode?: number;             // الباركود
  fullName?: string;            // الاسم
  nationalId?: string;          // الرقم الوطني
  phone?: string;               // رقم الهاتف
  knownPhone?: string;          // رقم الهاتف المعرف
  email?: string;               // البريد الاكتروني (Memo)
  currentAddress?: string;      // العنوان الحالي
  nationality?: string;         // الجنسية — FK → Nationality
  residenceCard?: string;       // رقم بطاقة الإقامة
  passportNumber?: string;      // رقم جواز السفر
  birthPlace?: string;          // مكان الولادة
  birthDate?: Date;             // تاريخ الولادة
  motherName?: string;          // إسم الاسم
  maritalStatus?: string;       // الحالة الاجتماعية
  religion?: string;            // الديانة — FK → Religion
  hireDate?: Date;              // تاريخ التعيين
  contractDuration?: Date;      // مدة العقد
  workStatus?: string;          // حالة العمل — "Active", "Terminated", etc.
  jobFunctionId?: number;       // رقم الوظيفة — FK → JobFunction
  departmentId?: number;        // رقم القسم — FK → JobFunction.departmentId
  socialInsuranceNumber?: string; // رقم الضمان الاجتماعي
  healthInsuranceGrade?: string;  // درجة التأمين الصحي
  photo?: Blob;                 // صورة الموظف
  accountNumber?: number;       // رقم الحساب
  bankId?: number;              // رقم البنك — FK → Bank
  bankAccountNumber?: string;   // رقم الحساب البنكي
  hourlyRate: number;           // سعر ساعة العمل — Double, NOT NULL
  workingHours?: number;        // عدد ساعات العمل
  dailyWage?: number;           // اجرة اليومية
  insuranceDeduction?: number;  // خصم قيمة الضمان
  healthInsuranceDeduction?: number; // خصم بدل تأمين الصحي
  costOfLivingAllowance?: number;   // بدل غلاء معيشة
  weeklyDeductions?: number;    // قيمة الاقتطاعات الاسبوعية
}

// -------------------- 3. MOVEMENT (movment) — Time/Attendance/Salary --------------------
export interface Movement {
  dateNo?: string;              // FK → MainPeriod.dateNo
  employeeNo?: number;          // NAME NO — FK → AccessEmployee.jobNumber
  days?: number;                // DAYS — Single
  faction?: number;             // FACTION — Single (allowance)
  addHours?: number;            // ADD_HOURS — Single (overtime)
  aqAss?: number;               // AQ_ASS — Single
  ammAss?: number;              // AMM_ASS — Single
  procedure?: number;           // PROCEDURE — Single
  takafol?: number;             // takafol — Single (pension)
  aytam?: number;               // aytam — Long (orphan fund)
}

// -------------------- 4. USERS (users) — System Users --------------------
export interface AppUser {
  username: string;             // PK, Text(255)
  fullName?: string;            // fulname
  password?: string;            // pass
  time?: Date;                  // time
  lastDate?: Date;              // lastdate
  userCode?: number;            // usercode
  userStore?: string;           // userstro
  userBranch?: string;          // userbranch
  ss?: boolean;                 // SS
  cash?: string;                // CASH
  // Permission flags (A-Q)
  permA?: boolean;
  permB?: boolean;
  permC?: boolean;
  permE?: boolean;
  permF?: boolean;
  permG?: boolean;
  permH?: boolean;
  permI?: boolean;
  permJ?: boolean;
  permK?: boolean;
  permW?: boolean;
  permM?: boolean;
  permO?: boolean;
  permQ?: boolean;
  shaft?: string;               // shaft
  job?: string;                 // JOB
  noCasha?: number;             // no casha
  casha?: string;               // casha
  nno?: number;                 // nno
}

// -------------------- 5. APP USERS (المستخدمين) — Local System Users --------------------
export interface AppUserLocal {
  id?: number;                  // المعرف — AutoNumber PK
  username?: string;            // اسم المستخدم
  password?: string;            // كلمة السر
  role?: string;                // الصلاحية
  canAdd?: boolean;             // اضافة
  canDelete?: boolean;          // حذف
  canEdit?: boolean;            // تعديل
}

// -------------------- 6. FINANCIAL ADVANCES (السلفة المالية) --------------------
export interface FinancialAdvance {
  employeeNo: number;           // الرقم الوظيفي — FK → AccessEmployee
  price?: number;               // السعر — Double
  totalPrice?: number;          // سعر الاجمالي — Double
  downPayment?: number;         // قيمة دفعة الاولى — Double
  netPrice?: number;            // سعر النهائي — Double
  installmentValue?: number;    // قيمة القسط — Double
  firstInstallmentDate?: Date;  // تاريخ اول قسط — Date
  installmentCount?: number;    // عدد الاقساط — Long
}

// -------------------- 7. INSTALLMENTS (الاقساط) --------------------
export interface Installment {
  id?: number;                  // المعرف — AutoNumber PK
  employeeNo?: number;          // الرقم الوظيفي — FK → AccessEmployee
  paymentDate?: Date;           // تاريخ القسط
  amount?: number;              // مبلغ القسط — Double
  paymentStatus?: string;       // حالة الدفع — "Paid", "Pending"
}

// -------------------- 8. LEAVE RECORDS (بيان الاجازات) --------------------
export interface LeaveRecord {
  id?: number;                  // المعرف — AutoNumber PK
  startDate?: Date;             // تاريخ بدء الاجازة
  employeeNo?: number;          // رقم الوظيفي — FK → AccessEmployee
  leaveType?: string;           // نوع الاجازة — FK → LeaveType
  daysCount?: number;           // عدد ايام الاجازة
  email?: string;               // البريد الاكتروني
}

// -------------------- 9. LEAVE TYPES (انواع الاجازات) --------------------
export interface LeaveType {
  leaveType: string;            // PK — نوع الاجازة
  description?: string;         // وصف
  maxDays?: number;             // الحد الأقصى للأيام
}

// -------------------- 10. VEHICLES (المركبات) --------------------
export interface Vehicle {
  vehicleCode?: number;         // كود المركبة — AutoNumber
  plateNumber: string;          // رقم اللوحة — PK, Text(8)
  barcode?: string;             // الباركود
  vehicleType?: string;         // نوع المركبة
  vehicleClass?: string;        // صنف السيارة
  registrationNumber?: number;  // رقم التسجيل
  model?: string;               // الموديل — Text(4)
  color?: string;               // اللون — Text(10)
  licensedUntil?: Date;         // مرخصة لغاية
  insuranceExpiry?: Date;       // تاريخ انتهاء التأمين
  insuranceCompany?: string;    // شركة التأمين
  engineNumber?: string;        // رقم المحرك
  chassisNumber?: string;       // رقم الشاصي
  ownerName?: string;           // اسم المالك
  licenseImages?: Blob;         // صور الرخصة و التأمين
  vehicleLogo?: Blob;           // شعار السيارة
  insuranceAmount?: number;     // المبلغ التأمين — Currency
  price?: number;               // سعر — Currency
  maxDailyDistance?: number;    // المسافة المسموح بها لكل يوم
}

// -------------------- 11. VIOLATIONS (المخالفات) --------------------
export interface Violation {
  violationCode?: number;       // كود المخالفة — AutoNumber PK
  customerName?: string;        // الاسم العميل
  address?: string;             // العنوان
  phone?: string;               // رقم الهاتف
  identityNumber?: string;      // رقم الهوية
  plateNumber?: string;         // رقم اللوحة — FK → Vehicle
  violation?: string;           // المخالفة
  fineAmount?: number;          // قيمة المخالفة — Currency
  violationDate?: Date;         // تاريخ المخالفة
  violationTime?: Date;         // وقت المخالفة
  violationPlace?: string;      // مكان المخالفة
  paymentStatus?: boolean;      // حالة الدفع
  violationImage?: Blob;        // صورة المخالفة
}

// -------------------- 12. COMPANY DATA (بيانات الشركة) --------------------
export interface CompanyData {
  id: number;                   // Primary key for Dexie
  companyName?: string;         // اسم الشركة
  address?: string;             // العنوان
  phone?: string;               // الهاتف
  email?: string;               // البريد الالكتروني
  taxNumber?: string;           // الرقم الضريبي
  commercialRegister?: string;  // السجل التجاري
  logo?: Blob;                  // شعار الشركة
}

// -------------------- 13. BANKS (البنك) --------------------
export interface Bank {
  bankCode: number;             // رقم البنك — PK, Long
  bankName?: string;            // اسم البنك
}

// -------------------- 14. NATIONALITIES (الجنسية) --------------------
export interface Nationality {
  id?: number;                  // المعرف — AutoNumber PK
  nationality?: string;         // الجنسية
  code?: number;                // الكود — Long
}

// -------------------- 15. RELIGIONS (الديانة) --------------------
export interface Religion {
  religion: string;             // الديانة — PK
}

// -------------------- 16. JOB FUNCTIONS (الوظيفة) --------------------
export interface JobFunction {
  departmentId: number;         // رقم القسم — PK, Long
  jobFunctionId?: number;       // رقم الوظيفة — Long
  department?: string;          // القسم — Text(20)
  jobFunction?: string;         // الوظيفة — Text(20)
}

// -------------------- 17. VEHICLE TYPES (انواع السيارات) --------------------
export interface VehicleType {
  code?: number;                // الكود
  typeName?: string;            // نوع السيارة
}

// -------------------- 18. DATA (بيانات) — Generic logging --------------------
export interface LogData {
  id?: number;                  // المعرف — AutoNumber PK
  statement?: string;           // بيان
  number?: number;              // الرقم
  date?: Date;                  // التاريخ
  userName?: string;            // اسم المستخدم
}

// -------------------- 19. LOGIN/LOGOUT (تسجيل الدخول والخروج) --------------------
export interface LoginLogout {
  id?: number;
  username?: string;
  loginTime?: Date;
  logoutTime?: Date;
  sessionDuration?: number;     // in minutes
}

// ========================================================================
// Derived/Computed Types
// ========================================================================

// Monthly salary computation result (matching all-inq_1 query)
export interface SalaryComputation {
  employee: AccessEmployee;
  movement: Movement;
  period: MainPeriod;
  // Computed: [daily_wage] + [DAYS] - [PROCEDURE] + [weekly_deductions]
  empTotalSalary: number;
  // Computed: ([dailyWage]) * ([DAYS] + ([ADD_HOURS]/8)) - [weeklyDeductions] - [PROCEDURE]
  contSalary: number;
  netPay: number;
  allowancesTotal: number;
  deductionsTotal: number;
}

// Reference data for dropdowns/selects
export interface ReferenceData {
  banks: Bank[];
  nationalities: Nationality[];
  religions: Religion[];
  jobFunctions: JobFunction[];
  leaveTypes: LeaveType[];
  vehicleTypes: VehicleType[];
  companyData?: CompanyData;
}

// ========================================================================
// IndexedDB Schema Helper
// ========================================================================
export const DB_SCHEMA = {
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
};