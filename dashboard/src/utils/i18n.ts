export type Language = 'en' | 'ar';

export const translations = {
  en: {
    // Layout & App Headers
    appTitle: "HR Attrition & Intelligence Report",
    appSubtitle: "Enterprise Analytics Portal",
    resetBtn: "Reset",
    activeFilters: "Active Filters",
    filterCountText: "{filtered} of {total} Employees",
    langBtn: "العربية",

    // Tabs
    tabOverview: "Employees",
    tabAttrition: "Attrition",
    tabSalary: "Compensation",
    tabSatisfaction: "Wellbeing",
    tabPerformance: "Performance",
    tabPredictor: "Attrition Predictor",
    tabPredictorBadge: "AI",
    tabDataEntry: "Data Entry",

    // Data Entry Form
    formSectGeneral: "General & Demographics",
    formSectWork: "Work & Role",
    formSectFinancials: "Financials & Rates",
    formSectTenure: "Tenures & History",
    formSectWellbeing: "Feedback & Reviews",

    formHeaderAdd: "Add New Employee",
    formHeaderEdit: "Edit Employee",
    btnCreate: "Create Employee",
    btnUpdate: "Save Changes",
    btnCancel: "Cancel",
    btnDelete: "Delete",
    btnEdit: "Edit",
    btnAddEmployee: "Add Employee",
    lblSearch: "Search ID, Role, Department...",
    lblConfirmDeleteTitle: "Confirm Delete",
    lblConfirmDeleteMsg: "Are you sure you want to delete employee {id}?",
    lblShowingCount: "Showing {start} to {end} of {total} Employees",
    valRequired: "This field is required",
    valPositiveNumber: "Must be a positive number",
    valRange: "Must be between {min} and {max}",

    // Field labels
    fieldAge: "Age",
    fieldAttrition: "Attrition",
    fieldBusinessTravel: "Business Travel",
    fieldDailyRate: "Daily Rate ($)",
    fieldDepartment: "Department",
    fieldDistanceFromHome: "Distance From Home (km)",
    fieldEducation: "Education Level",
    fieldEducationField: "Education Field",
    fieldEnvironmentSatisfaction: "Environment Satisfaction",
    fieldGender: "Gender",
    fieldHourlyRate: "Hourly Rate ($)",
    fieldJobInvolvement: "Job Involvement",
    fieldJobLevel: "Job Level",
    fieldJobRole: "Job Role",
    fieldJobSatisfaction: "Job Satisfaction",
    fieldMaritalStatus: "Marital Status",
    fieldMonthlyIncome: "Monthly Income ($)",
    fieldMonthlyRate: "Monthly Rate ($)",
    fieldNumCompaniesWorked: "Companies Worked",
    fieldOverTime: "Works Overtime?",
    fieldPercentSalaryHike: "Salary Hike (%)",
    fieldPerformanceRating: "Performance Rating",
    fieldRelationshipSatisfaction: "Relationship Satisfaction",
    fieldStockOptionLevel: "Stock Option Level",
    fieldTotalWorkingYears: "Total Working Years",
    fieldTrainingTimesLastYear: "Training Sessions Last Year",
    fieldWorkLifeBalance: "Work Life Balance",
    fieldYearsAtCompany: "Years At Company",
    fieldYearsInCurrentRole: "Years In Current Role",
    fieldYearsSinceLastPromotion: "Years Since Last Promotion",
    fieldYearsWithCurrManager: "Years With Current Manager",
    fieldEmployeeNumber: "Employee Number",

    // KPI Cards
    kpiTotalEmployees: "Total Employees",
    kpiTotalEmployeesSub: "Active headcount",
    kpiAttritionRate: "Attrition Rate",
    kpiAttritionRateSub: "Percentage who left",
    kpiEmployeesLeft: "Employees Left",
    kpiEmployeesLeftSub: "Voluntary departures",
    kpiEmployeesStayed: "Employees Stayed",
    kpiEmployeesStayedSub: "Retained personnel",
    kpiAverageAge: "Average Age",
    kpiAverageAgeSub: "Years old",
    kpiAvgDistance: "Avg Distance from Home",
    kpiAvgDistanceSub: "Average one-way commute",
    kpiOvertimeRate: "Overtime Rate",
    kpiOvertimeRateSub: "Percentage working overtime",
    kpiAvgIncome: "Average Monthly Income",
    kpiAvgIncomeSub: "Monthly base salary",
    kpiAvgHike: "Average Salary Hike",
    kpiAvgHikeSub: "Annual increment rate",
    kpiAvgTenure: "Average Company Tenure",
    kpiAvgTenureSub: "Years of employment",
    kpiAvgSatisfaction: "Average Job Satisfaction",
    kpiAvgSatisfactionSub: "Overall feedback rating",
    kpiAvgYearsRole: "Avg Years in Role",
    kpiAvgYearsRoleSub: "Role-specific stability",
    kpiAvgPerformance: "Avg Performance Rating",
    kpiAvgPerformanceSub: "Annual review score",
    kpiAvgTraining: "Avg Training Times",
    kpiAvgTrainingSub: "Sessions last year",

    // Slicers Panel
    slicerDept: "Department",
    slicerRole: "Job Role",
    slicerGender: "Gender",
    slicerTravel: "Business Travel",
    slicerAttrition: "Attrition",
    allDepts: "All Departments",
    allRoles: "All Roles",
    allGenders: "All Genders",
    allTravels: "All Travel Freq.",
    allAttritions: "All Statuses",

    // Overview Tab Charts
    chartGenderTitle: "Headcount by Gender",
    chartMaritalTitle: "Attrition by Marital Status",
    chartDeptTitle: "Headcount by Department",
    chartAgeTitle: "Attrition by Age Group",
    chartEduFieldTitle: "Attrition by Education Field",
    legendStayed: "Stayed",
    legendLeft: "Left",
    headcount: "Headcount",
    employeesUnit: "Employees",

    // Attrition Tab Charts & Table
    chartOvertimeTitle: "Attrition Rate by Overtime",
    chartDistanceTitle: "Attrition Rate by Commute Distance",
    chartAgeRateTitle: "Attrition Rate by Age Group",
    chartPromotionTitle: "Attrition by Time Since Last Promotion",
    tableMatrixTitle: "Detailed Attrition Risk by Role and Department",
    tableHeaderDept: "Department",
    tableHeaderRole: "Job Role",
    tableHeaderRate: "Attrition Rate",
    tableHeaderLeft: "Employees Left",
    tableHeaderTotal: "Total Headcount",

    // Salary Tab Charts
    chartRoleIncomeTitle: "Average Monthly Income by Job Role",
    chartPerfHikeTitle: "Average Salary Hike by Performance Rating",
    chartSalarySlabTitle: "Attrition by Salary Slab",
    chartTenureIncomeTitle: "Average Monthly Income Growth by Years at Company",
    chartTenureAxisLabel: "Years at Company",
    avgIncomeLegend: "Avg Income",
    avgHikeLegend: "Avg Hike",

    // Satisfaction Tab Charts
    chartJobSatTitle: "Job Satisfaction Distribution (%)",
    chartEnvSatTitle: "Attrition Rate by Environment Satisfaction",
    chartRelSatTitle: "Attrition Rate by Relationship Satisfaction",
    chartStockOptionTitle: "Attrition by Stock Option Level",
    chartWorkLifeTitle: "Attrition by Work Life Balance Rating",
    chartTravelAttrTitle: "Attrition Rate by Business Travel Frequency",
    distribution: "Distribution",

    // Performance Tab Charts
    chartEduLevelTitle: "Attrition Rate by Education Level",
    chartPerfDistTitle: "Performance Rating Distribution",
    chartTrainingTitle: "Attrition Rate by Training Times Last Year",
    chartInvolvementTitle: "Attrition Rate by Job Involvement Rating",

    // Predictor Tab (ML Simulator)
    predTitle: "Early Warning Attrition Risk Predictor",
    predSubtitle: "Interactive ML simulator powered by the project's trained Logistic Regression model.",
    predCustomSim: "-- Custom Simulation --",
    predReset: "Reset",
    predAdjustParams: "Adjust Simulation Parameters",
    predAge: "Age",
    predMonthlyIncome: "Monthly Income",
    predDistance: "DistanceFromHome",
    predCompanies: "Companies Worked",
    predYearsCompany: "Years at Company",
    predJobLevelLabel: "Job Level (Category)",
    predJobSatLabel: "Job Satisfaction",
    predEnvSatLabel: "Environment Satisfaction",
    predWorkLifeLabel: "Work Life Balance",
    predOvertimeLabel: "Works Overtime?",
    predClassification: "Classification",
    predLinearScore: "Linear Score (z)",
    predDiagnosticTitle: "Retention Diagnostic Report",
    predRiskDrivers: "Risk Drivers (Boosters)",
    predStabilizingFactors: "Stabilizing Factors (Mitigators)",
    predHrActions: "Strategic HR Actions",
    predLowRiskMsg: "✅ Low risk. Current metrics indicate high job stability.",
    predModRiskMsg: "💡 Moderate risk. Keep track of employee workload and satisfaction.",
    predHighRiskMsg: "⚠️ High attrition risk. Proactive retention measures are highly recommended.",

    // Job Levels
    lvl1: "Entry Level (1)",
    lvl2: "Associate (2)",
    lvl3: "Mid-Senior (3)",
    lvl4: "Director (4)",
    lvl5: "Executive (5)",

    // Satisfaction levels
    satLow: "Low (1)",
    satMed: "Medium (2)",
    satHigh: "High (3)",
    satVeryHigh: "Very High (4)",

    // WorkLife levels
    wlPoor: "Poor (1)",
    wlFair: "Fair (2)",
    wlGood: "Good (3)",
    wlEx: "Excellent (4)"
  },
  ar: {
    // Layout & App Headers
    appTitle: "تقرير ذكاء وتحليل تسرب الموظفين",
    appSubtitle: "بوابة تحليلات المؤسسة",
    resetBtn: "إعادة تعيين",
    activeFilters: "الفلاتر النشطة",
    filterCountText: "{filtered} من {total} موظف",
    langBtn: "English",

    // Tabs
    tabOverview: "الموظفون",
    tabAttrition: "تسرب الموظفين",
    tabSalary: "التعويضات",
    tabSatisfaction: "الرضا والرفاهية",
    tabPerformance: "الأداء والنمو",
    tabPredictor: "متنبئ التسرب",
    tabPredictorBadge: "ذكاء اصطناعي",
    tabDataEntry: "إدخال البيانات",

    // Data Entry Form
    formSectGeneral: "العامة والديموغرافية",
    formSectWork: "العمل والدور الوظيفي",
    formSectFinancials: "الماليات والأجور",
    formSectTenure: "سنوات الخدمة والسجل",
    formSectWellbeing: "التقييمات والرفاهية",

    formHeaderAdd: "إضافة موظف جديد",
    formHeaderEdit: "تعديل بيانات الموظف",
    btnCreate: "إضافة الموظف",
    btnUpdate: "حفظ التغييرات",
    btnCancel: "إلغاء",
    btnDelete: "حذف",
    btnEdit: "تعديل",
    btnAddEmployee: "إضافة موظف",
    lblSearch: "بحث بالمعرف، الدور، القسم...",
    lblConfirmDeleteTitle: "تأكيد الحذف",
    lblConfirmDeleteMsg: "هل أنت متأكد من حذف الموظف {id}؟",
    lblShowingCount: "عرض {start} إلى {end} من {total} موظف",
    valRequired: "هذا الحقل مطلوب",
    valPositiveNumber: "يجب أن يكون رقماً موجباً",
    valRange: "يجب أن يكون بين {min} و {max}",

    // Field labels
    fieldAge: "العمر",
    fieldAttrition: "التسرب",
    fieldBusinessTravel: "سفر العمل",
    fieldDailyRate: "المعدل اليومي ($)",
    fieldDepartment: "القسم",
    fieldDistanceFromHome: "المسافة من المنزل (كم)",
    fieldEducation: "المستوى التعليمي",
    fieldEducationField: "التخصص الدراسي",
    fieldEnvironmentSatisfaction: "الرضا عن البيئة",
    fieldGender: "الجنس",
    fieldHourlyRate: "الأجر الساعي ($)",
    fieldJobInvolvement: "الاندماج الوظيفي",
    fieldJobLevel: "المستوى الوظيفي",
    fieldJobRole: "الدور الوظيفي",
    fieldJobSatisfaction: "الرضا الوظيفي",
    fieldMaritalStatus: "الحالة الاجتماعية",
    fieldMonthlyIncome: "الدخل الشهري ($)",
    fieldMonthlyRate: "المعدل الشهري ($)",
    fieldNumCompaniesWorked: "عدد الشركات السابقة",
    fieldOverTime: "يعمل وقتاً إضافياً؟",
    fieldPercentSalaryHike: "نسبة زيادة الراتب (%)",
    fieldPerformanceRating: "تقييم الأداء",
    fieldRelationshipSatisfaction: "الرضا عن العلاقات",
    fieldStockOptionLevel: "خيارات الأسهم للموظف",
    fieldTotalWorkingYears: "إجمالي سنوات العمل",
    fieldTrainingTimesLastYear: "عدد التدريبات العام الماضي",
    fieldWorkLifeBalance: "التوازن بين العمل والحياة",
    fieldYearsAtCompany: "سنوات الخدمة في الشركة",
    fieldYearsInCurrentRole: "سنوات العمل في نفس الدور",
    fieldYearsSinceLastPromotion: "سنوات منذ آخر ترقية",
    fieldYearsWithCurrManager: "سنوات العمل مع المدير الحالي",
    fieldEmployeeNumber: "رقم الموظف",

    // KPI Cards
    kpiTotalEmployees: "إجمالي الموظفين",
    kpiTotalEmployeesSub: "عدد الموظفين الحاليين",
    kpiAttritionRate: "معدل التسرب",
    kpiAttritionRateSub: "نسبة الموظفين الذين غادروا",
    kpiEmployeesLeft: "الموظفون المغادرون",
    kpiEmployeesLeftSub: "حالات المغادرة الطوعية",
    kpiEmployeesStayed: "الموظفون المستمرون",
    kpiEmployeesStayedSub: "الموظفون الذين تم الاحتفاظ بهم",
    kpiAverageAge: "متوسط العمر",
    kpiAverageAgeSub: "سنة",
    kpiAvgDistance: "متوسط المسافة من المنزل",
    kpiAvgDistanceSub: "متوسط مسافة التنقل اليومي",
    kpiOvertimeRate: "معدل العمل الإضافي",
    kpiOvertimeRateSub: "نسبة من يعملون وقتاً إضافياً",
    kpiAvgIncome: "متوسط الدخل الشهري",
    kpiAvgIncomeSub: "الراتب الشهري الأساسي",
    kpiAvgHike: "متوسط الزيادة في الراتب",
    kpiAvgHikeSub: "معدل الزيادة السنوية",
    kpiAvgTenure: "متوسط سنوات الخدمة",
    kpiAvgTenureSub: "سنوات العمل في الشركة",
    kpiAvgSatisfaction: "متوسط الرضا الوظيفي",
    kpiAvgSatisfactionSub: "تقييم التغذية الراجعة العام",
    kpiAvgYearsRole: "سنوات العمل في نفس الدور",
    kpiAvgYearsRoleSub: "الاستقرار في الدور الوظيفي",
    kpiAvgPerformance: "متوسط تقييم الأداء",
    kpiAvgPerformanceSub: "درجة المراجعة السنوية",
    kpiAvgTraining: "متوسط الدورات التدريبية",
    kpiAvgTrainingSub: "عدد الدورات العام الماضي",

    // Slicers Panel
    slicerDept: "القسم",
    slicerRole: "الدور الوظيفي",
    slicerGender: "الجنس",
    slicerTravel: "سفر العمل",
    slicerAttrition: "التسرب",
    allDepts: "جميع الأقسام",
    allRoles: "جميع الأدوار الوظيفية",
    allGenders: "جميع الجنسين",
    allTravels: "جميع درجات السفر",
    allAttritions: "جميع الحالات",

    // Overview Tab Charts
    chartGenderTitle: "توزيع الموظفين حسب الجنس",
    chartMaritalTitle: "التسرب حسب الحالة الاجتماعية",
    chartDeptTitle: "توزيع الموظفين حسب القسم",
    chartAgeTitle: "التسرب حسب الفئة العمرية",
    chartEduFieldTitle: "التسرب حسب التخصص الدراسي",
    legendStayed: "مستمر",
    legendLeft: "مغادر",
    headcount: "عدد الموظفين",
    employeesUnit: "موظف",

    // Attrition Tab Charts & Table
    chartOvertimeTitle: "معدل التسرب حسب العمل الإضافي",
    chartDistanceTitle: "معدل التسرب حسب مسافة التنقل",
    chartAgeRateTitle: "معدل التسرب حسب الفئة العمرية",
    chartPromotionTitle: "التسرب حسب السنوات منذ آخر ترقية",
    tableMatrixTitle: "تفاصيل مخاطر التسرب حسب الدور الوظيفي والقسم",
    tableHeaderDept: "القسم",
    tableHeaderRole: "الدور الوظيفي",
    tableHeaderRate: "معدل التسرب",
    tableHeaderLeft: "المغادرون",
    tableHeaderTotal: "الإجمالي",

    // Salary Tab Charts
    chartRoleIncomeTitle: "متوسط الدخل الشهري حسب الدور الوظيفي",
    chartPerfHikeTitle: "متوسط زيادة الراتب حسب تقييم الأداء",
    chartSalarySlabTitle: "التسرب حسب فئات الرواتب",
    chartTenureIncomeTitle: "نمو الدخل الشهري حسب سنوات الخدمة",
    chartTenureAxisLabel: "سنوات الخدمة في الشركة",
    avgIncomeLegend: "متوسط الدخل",
    avgHikeLegend: "متوسط الزيادة",

    // Satisfaction Tab Charts
    chartJobSatTitle: "توزيع الرضا الوظيفي (%)",
    chartEnvSatTitle: "معدل التسرب حسب الرضا عن بيئة العمل",
    chartRelSatTitle: "معدل التسرب حسب الرضا عن علاقات العمل",
    chartStockOptionTitle: "التسرب حسب خيارات الأسهم للموظفين",
    chartWorkLifeTitle: "التسرب حسب تقييم التوازن بين العمل والحياة",
    chartTravelAttrTitle: "معدل التسرب حسب تكرار سفر العمل",
    distribution: "التوزيع",

    // Performance Tab Charts
    chartEduLevelTitle: "معدل التسرب حسب المستوى التعليمي",
    chartPerfDistTitle: "توزيع تقييم الأداء",
    chartTrainingTitle: "معدل التسرب حسب عدد التدريبات العام الماضي",
    chartInvolvementTitle: "معدل التسرب حسب درجة الاندماج الوظيفي",

    // Predictor Tab (ML Simulator)
    predTitle: "متنبئ مخاطر تسرب الموظفين المبكر",
    predSubtitle: "محاكاة ذكاء اصطناعي تفاعلية مدعومة بنموذج الانحدار اللوجستي الذي تم تدريبه في المشروع.",
    predCustomSim: "-- محاكاة مخصصة --",
    predReset: "إعادة تعيين",
    predAdjustParams: "ضبط متغيرات المحاكاة",
    predAge: "العمر",
    predMonthlyIncome: "الدخل الشهري",
    predDistance: "المسافة من المنزل",
    predCompanies: "الشركات السابقة",
    predYearsCompany: "سنوات الخدمة",
    predJobLevelLabel: "المستوى الوظيفي (الفئة)",
    predJobSatLabel: "الرضا الوظيفي",
    predEnvSatLabel: "الرضا عن البيئة",
    predWorkLifeLabel: "التوازن بين العمل والحياة",
    predOvertimeLabel: "يعمل وقتاً إضافياً؟",
    predClassification: "التصنيف",
    predLinearScore: "الدرجة الخطية (z)",
    predDiagnosticTitle: "تقرير تشخيص الاحتفاظ بالموظف",
    predRiskDrivers: "عوامل الخطورة (مسببات المغادرة)",
    predStabilizingFactors: "العوامل الإيجابية (مثبتات البقاء)",
    predHrActions: "الإجراءات الاستراتيجية للموارد البشرية",
    predLowRiskMsg: "✅ مخاطر منخفضة. تشير المقاييس الحالية إلى استقرار وظيفي عالٍ.",
    predModRiskMsg: "💡 مخاطر متوسطة. يوصى بمراقبة ضغط العمل ومستويات الرضا لديه.",
    predHighRiskMsg: "⚠️ مخاطر تسرب عالية جداً. يوصى باتخاذ تدابير استباقية للاحتفاظ بالموظف فوراً.",

    // Job Levels
    lvl1: "مستوى مبتدئ (1)",
    lvl2: "مساعد (2)",
    lvl3: "أخصائي / متوسط (3)",
    lvl4: "مدير قسم (4)",
    lvl5: "مدير تنفيذي (5)",

    // Satisfaction levels
    satLow: "منخفض (1)",
    satMed: "متوسط (2)",
    satHigh: "مرتفع (3)",
    satVeryHigh: "مرتفع جداً (4)",

    // WorkLife levels
    wlPoor: "ضعيف (1)",
    wlFair: "مقبول (2)",
    wlGood: "جيد (3)",
    wlEx: "ممتاز (4)"
  }
};

// Raw value mappings for English data attributes to Arabic translations
export const dataTranslations: { [key: string]: string } = {
  // Departments
  'Research & Development': 'البحث والتطوير',
  'Sales': 'المبيعات',
  'Human Resources': 'الموارد البشرية',
  'R&D': 'البحث والتطوير',

  // Gender
  'Male': 'ذكر',
  'Female': 'أنثى',

  // Marital Status
  'Single': 'أعزب',
  'Married': 'متزوج',
  'Divorced': 'مطلق',

  // Job Roles
  'Research Scientist': 'باحث علمي',
  'Laboratory Technician': 'فني مختبر',
  'Manufacturing Director': 'مدير تصنيع',
  'Healthcare Representative': 'ممثل رعاية صحية',
  'Manager': 'مدير وظيفي',
  'Research Director': 'مدير أبحاث',
  'Sales Executive': 'مسؤول مبيعات',
  'Sales Representative': 'مندوب مبيعات',

  // Business Travel
  'Travel_Rarely': 'سفر نادر',
  'Travel_Frequently': 'سفر متكرر',
  'Non-Travel': 'بدون سفر',

  // Education Fields
  'Life Sciences': 'علوم الحياة',
  'Medical': 'طبية',
  'Marketing': 'تسويق',
  'Technical Degree': 'درجة تقنية',
  'Other': 'تخصصات أخرى',

  // Salary slabs
  'Upto $5K': 'حتى 5 آلاف $',
  '$5K-$10K': '5 - 10 آلاف $',
  '$10K-$15K': '10 - 15 ألف $',
  '$15K+': 'أكثر من 15 ألف $',

  // Satisfaction descriptive labels
  'Low': 'منخفض',
  'Medium': 'متوسط',
  'High': 'مرتفع',
  'Very High': 'مرتفع جداً',

  // Work-Life Balance descriptive labels
  'Poor': 'ضعيف',
  'Fair': 'مقبول',
  'Good': 'جيد',
  'Excellent': 'ممتاز',

  // Performance Rating labels
  'Excellent (Rating 3)': 'ممتاز (تقييم 3)',
  'Outstanding (Rating 4)': 'متميز (تقييم 4)',

  // Years Since Last Promotion descriptive labels
  'Recently (0-2 Yrs)': 'حديثاً (0-2 سنة)',
  'Mid (3-4 Yrs)': 'متوسط (3-4 سنوات)',
  'Stagnant (5+ Yrs)': 'راكد (5+ سنوات)',

  // Commute Distance Slabs
  'Near (1-5 km)': 'قريب (1-5 كم)',
  'Moderate (6-15 km)': 'متوسط (6-15 كم)',
  'Far (16-30 km)': 'بعيد (16-30 كم)',

  // Education Levels
  'Below College': 'دون الجامعي',
  'College': 'دبلوم / كلية',
  'Bachelor': 'بكالوريوس',
  'Master': 'ماجستير',
  'Doctor': 'دكتوراه',

  // Overtime options
  'Works Overtime': 'يعمل وقتاً إضافياً',
  'No Overtime': 'لا يعمل وقتاً إضافياً'
};

// Global Translation Helper
export const t = (key: keyof typeof translations['en'], lang: Language): string => {
  return translations[lang][key] || translations['en'][key] || String(key);
};

// Data Attribute Translation Helper
export const translateValue = (value: string | number, lang: Language): string => {
  if (lang === 'en') return String(value);
  const valStr = String(value);
  return dataTranslations[valStr] || valStr;
};

// Diagnostic translation helpers for Predictor ML Tab
export const translateDiagnosticFactor = (factor: string, lang: Language): string => {
  if (lang === 'en') return factor;
  
  if (factor.includes('Works Overtime')) return 'يعمل وقتاً إضافياً';
  if (factor.includes('No Overtime')) return 'لا يعمل وقتاً إضافياً';
  if (factor.includes('Far Commute')) {
    const km = factor.match(/\d+/)?.[0] || '';
    return `تنقل بعيد (${km} كم)`;
  }
  if (factor.includes('Local Residence')) return 'سكن محلي قريب';
  if (factor.includes('Low Job Satisfaction')) {
    const rate = factor.match(/\d\/\d/)?.[0] || '';
    return `رضا وظيفي منخفض (${rate})`;
  }
  if (factor.includes('High Job Satisfaction')) return 'رضا وظيفي مرتفع';
  if (factor.includes('Low Environment Satisfaction')) {
    const rate = factor.match(/\d\/\d/)?.[0] || '';
    return `رضا منخفض عن البيئة (${rate})`;
  }
  if (factor.includes('Positive Environment')) return 'بيئة عمل إيجابية';
  if (factor.includes('Low Work Life Balance')) {
    const rate = factor.match(/\d\/\d/)?.[0] || '';
    return `توازن ضعيف بين العمل والحياة (${rate})`;
  }
  if (factor.includes('Job-Hopping History')) {
    const count = factor.match(/\d+/)?.[0] || '';
    return `تاريخ تنقل وظيفي كثير (${count} شركات)`;
  }

  return factor;
};

export const translateDiagnosticImpact = (impact: string, lang: Language): string => {
  if (lang === 'en') return impact;

  if (impact.includes('Highest risk driver')) return 'أقوى مسبب لمخاطر التسرب (+1.58)';
  if (impact.includes('Significantly reduces churn risk')) return 'يقلل بشكل كبير من مخاطر التسرب';
  if (impact.includes('Increases travel fatigue')) return 'يزيد من إرهاق السفر (+0.03 لكل كم)';
  if (impact.includes('Low commute distance')) return 'المسافة القصيرة تدعم الاستمرار';
  if (impact.includes('Significant attrition driver')) return 'مؤشر تسرب رئيسي';
  if (impact.includes('Protective employee retention factor')) return 'عامل حماية للاحتفاظ بالموظف';
  if (impact.includes('Strong workplace risk factor')) return 'عامل خطورة قوي متعلق بالبيئة';
  if (impact.includes('Excellent workspace connection')) return 'ارتباط ممتاز ببيئة العمل';
  if (impact.includes('Elevates burnout risk')) return 'يزيد من خطر الاحتراق الوظيفي';
  if (impact.includes('Historically high mobility')) return 'معدل تنقل مرتفع تاريخياً';

  return impact;
};

export const translateRecommendation = (rec: string, lang: Language): string => {
  if (lang === 'en') return rec;

  if (rec.includes('Cap weekly overtime')) return 'الحد من ساعات العمل الإضافي الأسبوعية وتقديم تعويض عن الوقت الإضافي.';
  if (rec.includes('Introduce hybrid or remote')) return 'إدخال سياسات العمل الهجين أو عن بعد لتقليل عبء التنقل.';
  if (rec.includes('Conduct a structured career')) return 'إجراء مقابلة مراجعة لمسار التطوير المهني والمهام الوظيفية.';
  if (rec.includes('Investigate department culture')) return 'التحقيق في ثقافة القسم، التوافق مع المدير، أو تجهيزات مكان العمل.';
  if (rec.includes('Offer flexible schedule')) return 'تقديم مرونة في تنسيق مواعيد الدوام أو تقديم استشارات الرفاهية والتحقق منها.';
  if (rec.includes('Set up structured retention')) return 'وضع معالم احتفاظ واضحة للموظفين الموهوبين وأهداف ترقي طويلة الأجل.';
  if (rec.includes('Maintain current employee')) return 'الحفاظ على مشاركة الموظف الحالية وتعديل الرواتب ومتابعة مسار نموه.';

  return rec;
};
