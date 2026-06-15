import React, { useState, useMemo, useEffect } from 'react';
import type { Employee } from '../types/employee';
import { t, translateValue } from '../utils/i18n';
import type { Language } from '../utils/i18n';
import { 
  Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, AlertCircle, Info, CheckCircle2, Database 
} from 'lucide-react';

interface DataEntryTabProps {
  data: Employee[];
  setData: React.Dispatch<React.SetStateAction<Employee[]>>;
  lang: Language;
}

interface FormErrors {
  [key: string]: string;
}

export const DataEntryTab: React.FC<DataEntryTabProps> = ({ data, setData, lang }) => {
  const isRtl = lang === 'ar';

  // 1. Directory Search & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 2. Form State
  const maxEmpNum = useMemo(() => {
    if (data.length === 0) return 2000;
    return Math.max(...data.map(e => e.EmployeeNumber));
  }, [data]);

  const emptyFormState = (maxNum: number): Partial<Employee> => ({
    EmployeeNumber: maxNum + 1,
    Age: 30,
    Attrition: 'No',
    BusinessTravel: 'Travel_Rarely',
    DailyRate: 800,
    Department: 'Research & Development',
    DistanceFromHome: 10,
    Education: 3,
    EducationField: 'Life Sciences',
    EnvironmentSatisfaction: 3,
    Gender: 'Male',
    HourlyRate: 60,
    JobInvolvement: 3,
    JobLevel: 2,
    JobRole: 'Research Scientist',
    JobSatisfaction: 3,
    MaritalStatus: 'Single',
    MonthlyIncome: 5000,
    MonthlyRate: 15000,
    NumCompaniesWorked: 1,
    OverTime: 'No',
    PercentSalaryHike: 15,
    PerformanceRating: 3,
    RelationshipSatisfaction: 3,
    StockOptionLevel: 1,
    TotalWorkingYears: 8,
    TrainingTimesLastYear: 2,
    WorkLifeBalance: 3,
    YearsAtCompany: 5,
    YearsInCurrentRole: 3,
    YearsSinceLastPromotion: 1,
    YearsWithCurrManager: 3
  });

  const [formState, setFormState] = useState<Partial<Employee>>(emptyFormState(maxEmpNum));
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEmpId, setEditingEmpId] = useState<string | null>(null);
  const [activeFormTab, setActiveFormTab] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});

  // 3. Modals & Toast State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Auto-trigger toast close
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Adjust formState dynamically when maxEmpNum changes to sync next available EmployeeNumber
  useEffect(() => {
    if (!isEditMode) {
      setFormState(prev => ({ ...prev, EmployeeNumber: maxEmpNum + 1 }));
    }
  }, [maxEmpNum, isEditMode]);

  // Dynamic Job Roles mapping based on Department for a premium experience
  const departmentRoles: { [key: string]: string[] } = {
    'Research & Development': [
      'Research Scientist',
      'Laboratory Technician',
      'Manufacturing Director',
      'Healthcare Representative',
      'Research Director',
      'Manager'
    ],
    'Sales': [
      'Sales Executive',
      'Sales Representative',
      'Manager'
    ],
    'Human Resources': [
      'Human Resources',
      'Manager'
    ]
  };

  // Keep Job Role in sync if Department changes
  const handleDepartmentChange = (dept: string) => {
    const roles = departmentRoles[dept] || [];
    setFormState(prev => ({
      ...prev,
      Department: dept,
      JobRole: roles[0] || ''
    }));
  };

  // 4. Directory Search Logic
  const filteredEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return data;
    return data.filter(e => 
      e.EmpID.toLowerCase().includes(query) ||
      e.JobRole.toLowerCase().includes(query) ||
      translateValue(e.JobRole, lang).toLowerCase().includes(query) ||
      e.Department.toLowerCase().includes(query) ||
      translateValue(e.Department, lang).toLowerCase().includes(query)
    );
  }, [data, searchQuery, lang]);

  // Reset pagination if search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination bounds
  const totalItems = filteredEmployees.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedEmployees = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredEmployees, currentPage]);

  const showingStart = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const showingEnd = Math.min(currentPage * itemsPerPage, totalItems);

  // 5. Validation Logic
  const getErrorText = (errKey: string, lang: Language): string => {
    if (errKey === 'valRequired') return t('valRequired', lang);
    if (errKey === 'valPositiveNumber') return t('valPositiveNumber', lang);
    if (errKey.startsWith('Must be between')) {
      const parts = errKey.match(/\d+/g);
      if (parts && parts.length === 2) {
        const minVal = isRtl ? parseInt(parts[0]).toLocaleString('ar-EG') : parts[0];
        const maxVal = isRtl ? parseInt(parts[1]).toLocaleString('ar-EG') : parts[1];
        return lang === 'ar' ? `يجب أن يكون بين ${minVal} و ${maxVal}` : `Must be between ${parts[0]} and ${parts[1]}`;
      }
    }
    if (errKey === 'Employee Number must be unique') {
      return lang === 'ar' ? 'رقم الموظف يجب أن يكون فريداً وغير مكرر' : 'Employee Number must be unique';
    }
    return errKey;
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formState.EmployeeNumber || formState.EmployeeNumber <= 0) {
      errs.EmployeeNumber = 'valPositiveNumber';
    } else if (!isEditMode && data.some(e => e.EmployeeNumber === formState.EmployeeNumber)) {
      errs.EmployeeNumber = 'Employee Number must be unique';
    }

    if (formState.Age === undefined || formState.Age < 18 || formState.Age > 60) {
      errs.Age = 'Must be between 18 and 60';
    }

    if (formState.DistanceFromHome === undefined || formState.DistanceFromHome < 1 || formState.DistanceFromHome > 30) {
      errs.DistanceFromHome = 'Must be between 1 and 30';
    }

    if (!formState.DailyRate || formState.DailyRate < 100 || formState.DailyRate > 2000) {
      errs.DailyRate = 'Must be between 100 and 2000';
    }

    if (!formState.HourlyRate || formState.HourlyRate < 30 || formState.HourlyRate > 150) {
      errs.HourlyRate = 'Must be between 30 and 150';
    }

    if (!formState.MonthlyIncome || formState.MonthlyIncome < 1000 || formState.MonthlyIncome > 30000) {
      errs.MonthlyIncome = 'Must be between 1000 and 30000';
    }

    if (!formState.MonthlyRate || formState.MonthlyRate < 1000 || formState.MonthlyRate > 50000) {
      errs.MonthlyRate = 'Must be between 1000 and 50000';
    }

    if (formState.NumCompaniesWorked === undefined || formState.NumCompaniesWorked < 0 || formState.NumCompaniesWorked > 15) {
      errs.NumCompaniesWorked = 'Must be between 0 and 15';
    }

    if (formState.PercentSalaryHike === undefined || formState.PercentSalaryHike < 10 || formState.PercentSalaryHike > 30) {
      errs.PercentSalaryHike = 'Must be between 10 and 30';
    }

    if (formState.TotalWorkingYears === undefined || formState.TotalWorkingYears < 0 || formState.TotalWorkingYears > 50) {
      errs.TotalWorkingYears = 'Must be between 0 and 50';
    }

    if (formState.TrainingTimesLastYear === undefined || formState.TrainingTimesLastYear < 0 || formState.TrainingTimesLastYear > 10) {
      errs.TrainingTimesLastYear = 'Must be between 0 and 10';
    }

    if (formState.YearsAtCompany === undefined || formState.YearsAtCompany < 0 || formState.YearsAtCompany > 50) {
      errs.YearsAtCompany = 'Must be between 0 and 50';
    }

    if (formState.YearsInCurrentRole === undefined || formState.YearsInCurrentRole < 0 || formState.YearsInCurrentRole > 50) {
      errs.YearsInCurrentRole = 'Must be between 0 and 50';
    }

    if (formState.YearsSinceLastPromotion === undefined || formState.YearsSinceLastPromotion < 0 || formState.YearsSinceLastPromotion > 50) {
      errs.YearsSinceLastPromotion = 'Must be between 0 and 50';
    }

    if (formState.YearsWithCurrManager === undefined || formState.YearsWithCurrManager < 0 || formState.YearsWithCurrManager > 50) {
      errs.YearsWithCurrManager = 'Must be between 0 and 50';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Check if a form subsection contains fields with validation errors
  const formTabHasErrors = (tabIdx: number): boolean => {
    const fields = [
      ['EmployeeNumber', 'Age'], // General
      ['DistanceFromHome'], // Work
      ['DailyRate', 'HourlyRate', 'MonthlyIncome', 'MonthlyRate', 'PercentSalaryHike'], // Finance
      ['NumCompaniesWorked', 'TotalWorkingYears', 'YearsAtCompany', 'YearsInCurrentRole', 'YearsSinceLastPromotion', 'YearsWithCurrManager'], // Tenure
      ['TrainingTimesLastYear'] // Wellbeing / feedback
    ];
    return fields[tabIdx].some(field => !!errors[field]);
  };

  // Helper calculation formulas matching preprocess.py
  const calculateDerivedFields = (state: Partial<Employee>): Partial<Employee> => {
    const age = state.Age || 30;
    const income = state.MonthlyIncome || 5000;

    let ageGroup = '36-45';
    if (age <= 25) ageGroup = '18-25';
    else if (age <= 35) ageGroup = '26-35';
    else if (age <= 45) ageGroup = '36-45';
    else if (age <= 55) ageGroup = '46-55';
    else ageGroup = '55+';

    let salarySlab = '$5K-$10K';
    if (income <= 5000) salarySlab = 'Upto $5K';
    else if (income <= 10000) salarySlab = '$5K-$10K';
    else if (income <= 15000) salarySlab = '$10K-$15K';
    else salarySlab = '$15K+';

    return {
      ...state,
      AgeGroup: ageGroup,
      SalarySlab: salarySlab,
      EmpID: `RM${state.EmployeeNumber}`,
      EmployeeCount: 1,
      Over18: 'Y',
      StandardHours: 80
    };
  };

  // 6. CRUD Form Submissions
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Focus on the first tab containing errors
      for (let i = 0; i < 5; i++) {
        if (formTabHasErrors(i)) {
          setActiveFormTab(i);
          break;
        }
      }
      return;
    }

    const completedRecord = calculateDerivedFields(formState) as Employee;

    if (isEditMode && editingEmpId) {
      // Edit record
      setData(prev => prev.map(emp => emp.EmpID === editingEmpId ? completedRecord : emp));
      setToast(lang === 'ar' ? `تم تحديث الموظف ${editingEmpId} بنجاح` : `Employee ${editingEmpId} updated successfully`);
      handleCancelEdit();
    } else {
      // Add record
      setData(prev => [completedRecord, ...prev]);
      setToast(lang === 'ar' ? `تم إضافة الموظف ${completedRecord.EmpID} بنجاح` : `Employee ${completedRecord.EmpID} created successfully`);
      setFormState(emptyFormState(completedRecord.EmployeeNumber));
      setActiveFormTab(0);
      setErrors({});
    }
  };

  // Trigger Edit
  const handleEditStart = (emp: Employee) => {
    setIsEditMode(true);
    setEditingEmpId(emp.EmpID);
    setFormState({ ...emp });
    setActiveFormTab(0);
    setErrors({});
    // Scroll form into view on mobile
    const panel = document.getElementById('employee-form-panel');
    if (panel) panel.scrollIntoView({ behavior: 'smooth' });
  };

  // Cancel edit state
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingEmpId(null);
    setFormState(emptyFormState(maxEmpNum));
    setActiveFormTab(0);
    setErrors({});
  };

  // Confirm Delete Modal trigger
  const handleDeleteConfirm = (empId: string) => {
    setConfirmDeleteId(empId);
  };

  // Execute deletion
  const handleDeleteExecute = () => {
    if (confirmDeleteId) {
      setData(prev => prev.filter(emp => emp.EmpID !== confirmDeleteId));
      setToast(lang === 'ar' ? `تم حذف الموظف ${confirmDeleteId} بنجاح` : `Employee ${confirmDeleteId} deleted successfully`);
      if (editingEmpId === confirmDeleteId) {
        handleCancelEdit();
      }
      setConfirmDeleteId(null);
    }
  };

  // Form Field change helper
  const handleFieldChange = (field: keyof Employee, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', width: '100%', direction: isRtl ? 'rtl' : 'ltr' }}>
      
      {/* 1. Directory Panel (Left) */}
      <div 
        className="glass-panel-noclick" 
        style={{ 
          flex: '1 1 380px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px', 
          padding: '24px',
          maxHeight: '780px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={20} style={{ color: 'var(--accent-cyan)' }} />
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
              {isRtl ? 'دليل الموظفين' : 'Employee Directory'}
            </h2>
          </div>
          
          {isEditMode && (
            <button
              onClick={handleCancelEdit}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text-main)',
                fontSize: '12px',
                cursor: 'pointer',
                fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit'
              }}
            >
              <Plus size={14} />
              {t('btnAddEmployee', lang)}
            </button>
          )}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search 
            size={16} 
            style={{ 
              position: 'absolute', 
              right: isRtl ? '12px' : 'auto', 
              left: isRtl ? 'auto' : '12px', 
              color: 'var(--text-dim)' 
            }} 
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('lblSearch', lang)}
            className="input-select"
            style={{ 
              width: '100%', 
              paddingLeft: isRtl ? '12px' : '36px', 
              paddingRight: isRtl ? '36px' : '12px',
              fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit'
            }}
          />
        </div>

        {/* Employee Cards List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: isRtl ? '0' : '4px', paddingLeft: isRtl ? '4px' : '0' }}>
          {paginatedEmployees.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-dim)' }}>
              <Info size={28} style={{ marginBottom: '10px', color: 'var(--text-dim)' }} />
              <p style={{ fontSize: '13px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                {isRtl ? 'لا يوجد نتائج تطابق البحث' : 'No matching employee records found'}
              </p>
            </div>
          ) : (
            paginatedEmployees.map((emp) => {
              const isEditingThis = editingEmpId === emp.EmpID;
              return (
                <div 
                  key={emp.EmpID}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '8px',
                    border: isEditingThis ? '1px solid var(--accent-purple)' : '1px solid var(--border-color)',
                    background: isEditingThis ? 'hsla(263, 90%, 65%, 0.08)' : 'rgba(255, 255, 255, 0.01)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>
                      {emp.EmpID}
                      {emp.Attrition === 'Yes' && (
                        <span style={{ 
                          fontSize: '10px', 
                          backgroundColor: 'rgba(255, 50, 100, 0.1)', 
                          color: 'var(--color-left)', 
                          padding: '2px 6px', 
                          borderRadius: '8px', 
                          marginLeft: isRtl ? '0' : '8px', 
                          marginRight: isRtl ? '8px' : '0',
                          fontWeight: 700,
                          fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit'
                        }}>
                          {t('legendLeft', lang)}
                        </span>
                      )}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                      {translateValue(emp.JobRole, lang)} • {translateValue(emp.Department === 'Research & Development' ? 'R&D' : emp.Department, lang)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEditStart(emp)}
                      title={t('btnEdit', lang)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent-cyan)',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '4px',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm(emp.EmpID)}
                      title={t('btnDelete', lang)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-left)',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '4px',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Directory Pagination Footer */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-dim)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
          <span>
            {t('lblShowingCount', lang)
              .replace('{start}', isRtl ? showingStart.toLocaleString('ar-EG') : showingStart.toString())
              .replace('{end}', isRtl ? showingEnd.toLocaleString('ar-EG') : showingEnd.toString())
              .replace('{total}', isRtl ? totalItems.toLocaleString('ar-EG') : totalItems.toString())
            }
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                color: currentPage === 1 ? 'var(--text-dim)' : 'var(--text-main)',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.4 : 1
              }}
            >
              {isRtl ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                color: currentPage === totalPages ? 'var(--text-dim)' : 'var(--text-main)',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.4 : 1
              }}
            >
              {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Employee CRUD Form Panel (Right) */}
      <div 
        id="employee-form-panel"
        className="glass-panel-noclick" 
        style={{ 
          flex: '2 1 500px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px', 
          padding: '24px'
        }}
      >
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {isEditMode 
              ? `${t('formHeaderEdit', lang)}: ${editingEmpId}` 
              : t('formHeaderAdd', lang)
            }
          </h2>
        </div>

        {/* Section Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          {[
            { id: 0, key: 'formSectGeneral' as const },
            { id: 1, key: 'formSectWork' as const },
            { id: 2, key: 'formSectFinancials' as const },
            { id: 3, key: 'formSectTenure' as const },
            { id: 4, key: 'formSectWellbeing' as const }
          ].map((formTab) => {
            const isActive = activeFormTab === formTab.id;
            const hasTabErrors = formTabHasErrors(formTab.id);
            return (
              <button
                key={formTab.id}
                type="button"
                onClick={() => setActiveFormTab(formTab.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  position: 'relative',
                  fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit',
                  transition: 'all 0.2s'
                }}
              >
                {t(formTab.key, lang)}
                {hasTabErrors && (
                  <span style={{
                    position: 'absolute',
                    top: '4px',
                    right: isRtl ? 'auto' : '4px',
                    left: isRtl ? '4px' : 'auto',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-left)'
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Form Fields Renderer */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          
          {/* TAB 0: General Info */}
          {activeFormTab === 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldEmployeeNumber', lang)}
                </label>
                <input
                  type="number"
                  disabled={isEditMode}
                  value={formState.EmployeeNumber || ''}
                  onChange={(e) => handleFieldChange('EmployeeNumber', parseInt(e.target.value) || 0)}
                  className="input-select"
                  style={{ borderColor: errors.EmployeeNumber ? 'var(--color-left)' : 'var(--border-color)', opacity: isEditMode ? 0.6 : 1 }}
                />
                {errors.EmployeeNumber && (
                  <span style={{ color: 'var(--color-left)', fontSize: '11px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                    {getErrorText(errors.EmployeeNumber, lang)}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldAge', lang)}
                </label>
                <input
                  type="number"
                  value={formState.Age || ''}
                  onChange={(e) => handleFieldChange('Age', parseInt(e.target.value) || 0)}
                  className="input-select"
                  style={{ borderColor: errors.Age ? 'var(--color-left)' : 'var(--border-color)' }}
                />
                {errors.Age && (
                  <span style={{ color: 'var(--color-left)', fontSize: '11px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                    {getErrorText(errors.Age, lang)}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldGender', lang)}
                </label>
                <select
                  value={formState.Gender || 'Male'}
                  onChange={(e) => handleFieldChange('Gender', e.target.value)}
                  className="input-select"
                  style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
                >
                  <option value="Male">{translateValue('Male', lang)}</option>
                  <option value="Female">{translateValue('Female', lang)}</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldMaritalStatus', lang)}
                </label>
                <select
                  value={formState.MaritalStatus || 'Single'}
                  onChange={(e) => handleFieldChange('MaritalStatus', e.target.value)}
                  className="input-select"
                  style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
                >
                  <option value="Single">{translateValue('Single', lang)}</option>
                  <option value="Married">{translateValue('Married', lang)}</option>
                  <option value="Divorced">{translateValue('Divorced', lang)}</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldEducation', lang)}
                </label>
                <select
                  value={formState.Education || 3}
                  onChange={(e) => handleFieldChange('Education', parseInt(e.target.value))}
                  className="input-select"
                  style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
                >
                  <option value={1}>{translateValue('Below College', lang)} (1)</option>
                  <option value={2}>{translateValue('College', lang)} (2)</option>
                  <option value={3}>{translateValue('Bachelor', lang)} (3)</option>
                  <option value={4}>{translateValue('Master', lang)} (4)</option>
                  <option value={5}>{translateValue('Doctor', lang)} (5)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldEducationField', lang)}
                </label>
                <select
                  value={formState.EducationField || 'Life Sciences'}
                  onChange={(e) => handleFieldChange('EducationField', e.target.value)}
                  className="input-select"
                  style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
                >
                  <option value="Life Sciences">{translateValue('Life Sciences', lang)}</option>
                  <option value="Medical">{translateValue('Medical', lang)}</option>
                  <option value="Marketing">{translateValue('Marketing', lang)}</option>
                  <option value="Technical Degree">{translateValue('Technical Degree', lang)}</option>
                  <option value="Human Resources">{translateValue('Human Resources', lang)}</option>
                  <option value="Other">{translateValue('Other', lang)}</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldAttrition', lang)}
                </label>
                <select
                  value={formState.Attrition || 'No'}
                  onChange={(e) => handleFieldChange('Attrition', e.target.value)}
                  className="input-select"
                  style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
                >
                  <option value="No">{t('legendStayed', lang)}</option>
                  <option value="Yes">{t('legendLeft', lang)}</option>
                </select>
              </div>

            </div>
          )}

          {/* TAB 1: Work & Role */}
          {activeFormTab === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldDepartment', lang)}
                </label>
                <select
                  value={formState.Department || 'Research & Development'}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="input-select"
                  style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
                >
                  <option value="Research & Development">{translateValue('Research & Development', lang)}</option>
                  <option value="Sales">{translateValue('Sales', lang)}</option>
                  <option value="Human Resources">{translateValue('Human Resources', lang)}</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldJobRole', lang)}
                </label>
                <select
                  value={formState.JobRole || ''}
                  onChange={(e) => handleFieldChange('JobRole', e.target.value)}
                  className="input-select"
                  style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
                >
                  {(departmentRoles[formState.Department || 'Research & Development'] || []).map(role => (
                    <option key={role} value={role}>{translateValue(role, lang)}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldJobLevel', lang)}
                </label>
                <select
                  value={formState.JobLevel || 2}
                  onChange={(e) => handleFieldChange('JobLevel', parseInt(e.target.value))}
                  className="input-select"
                  style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
                >
                  <option value={1}>{t('lvl1', lang)}</option>
                  <option value={2}>{t('lvl2', lang)}</option>
                  <option value={3}>{t('lvl3', lang)}</option>
                  <option value={4}>{t('lvl4', lang)}</option>
                  <option value={5}>{t('lvl5', lang)}</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldBusinessTravel', lang)}
                </label>
                <select
                  value={formState.BusinessTravel || 'Travel_Rarely'}
                  onChange={(e) => handleFieldChange('BusinessTravel', e.target.value)}
                  className="input-select"
                  style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
                >
                  <option value="Travel_Rarely">{translateValue('Travel_Rarely', lang)}</option>
                  <option value="Travel_Frequently">{translateValue('Travel_Frequently', lang)}</option>
                  <option value="Non-Travel">{translateValue('Non-Travel', lang)}</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldOverTime', lang)}
                </label>
                <select
                  value={formState.OverTime || 'No'}
                  onChange={(e) => handleFieldChange('OverTime', e.target.value)}
                  className="input-select"
                  style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
                >
                  <option value="No">{translateValue('No Overtime', lang)}</option>
                  <option value="Yes">{translateValue('Works Overtime', lang)}</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldDistanceFromHome', lang)}
                </label>
                <input
                  type="number"
                  value={formState.DistanceFromHome || ''}
                  onChange={(e) => handleFieldChange('DistanceFromHome', parseInt(e.target.value) || 0)}
                  className="input-select"
                  style={{ borderColor: errors.DistanceFromHome ? 'var(--color-left)' : 'var(--border-color)' }}
                />
                {errors.DistanceFromHome && (
                  <span style={{ color: 'var(--color-left)', fontSize: '11px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                    {getErrorText(errors.DistanceFromHome, lang)}
                  </span>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: Financials & Rates */}
          {activeFormTab === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldMonthlyIncome', lang)}
                </label>
                <input
                  type="number"
                  value={formState.MonthlyIncome || ''}
                  onChange={(e) => handleFieldChange('MonthlyIncome', parseInt(e.target.value) || 0)}
                  className="input-select"
                  style={{ borderColor: errors.MonthlyIncome ? 'var(--color-left)' : 'var(--border-color)' }}
                />
                {errors.MonthlyIncome && (
                  <span style={{ color: 'var(--color-left)', fontSize: '11px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                    {getErrorText(errors.MonthlyIncome, lang)}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldPercentSalaryHike', lang)}
                </label>
                <input
                  type="number"
                  value={formState.PercentSalaryHike || ''}
                  onChange={(e) => handleFieldChange('PercentSalaryHike', parseInt(e.target.value) || 0)}
                  className="input-select"
                  style={{ borderColor: errors.PercentSalaryHike ? 'var(--color-left)' : 'var(--border-color)' }}
                />
                {errors.PercentSalaryHike && (
                  <span style={{ color: 'var(--color-left)', fontSize: '11px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                    {getErrorText(errors.PercentSalaryHike, lang)}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldDailyRate', lang)}
                </label>
                <input
                  type="number"
                  value={formState.DailyRate || ''}
                  onChange={(e) => handleFieldChange('DailyRate', parseInt(e.target.value) || 0)}
                  className="input-select"
                  style={{ borderColor: errors.DailyRate ? 'var(--color-left)' : 'var(--border-color)' }}
                />
                {errors.DailyRate && (
                  <span style={{ color: 'var(--color-left)', fontSize: '11px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                    {getErrorText(errors.DailyRate, lang)}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldHourlyRate', lang)}
                </label>
                <input
                  type="number"
                  value={formState.HourlyRate || ''}
                  onChange={(e) => handleFieldChange('HourlyRate', parseInt(e.target.value) || 0)}
                  className="input-select"
                  style={{ borderColor: errors.HourlyRate ? 'var(--color-left)' : 'var(--border-color)' }}
                />
                {errors.HourlyRate && (
                  <span style={{ color: 'var(--color-left)', fontSize: '11px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                    {getErrorText(errors.HourlyRate, lang)}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldMonthlyRate', lang)}
                </label>
                <input
                  type="number"
                  value={formState.MonthlyRate || ''}
                  onChange={(e) => handleFieldChange('MonthlyRate', parseInt(e.target.value) || 0)}
                  className="input-select"
                  style={{ borderColor: errors.MonthlyRate ? 'var(--color-left)' : 'var(--border-color)' }}
                />
                {errors.MonthlyRate && (
                  <span style={{ color: 'var(--color-left)', fontSize: '11px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                    {getErrorText(errors.MonthlyRate, lang)}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldStockOptionLevel', lang)}
                </label>
                <select
                  value={formState.StockOptionLevel || 0}
                  onChange={(e) => handleFieldChange('StockOptionLevel', parseInt(e.target.value))}
                  className="input-select"
                  style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
                >
                  <option value={0}>{isRtl ? 'لا يوجد أسهم (0)' : 'No Stock Options (0)'}</option>
                  <option value={1}>{isRtl ? 'أساسي (مستوى 1)' : 'Basic (Level 1)'}</option>
                  <option value={2}>{isRtl ? 'متوسط (مستوى 2)' : 'Higher (Level 2)'}</option>
                  <option value={3}>{isRtl ? 'تنفيذي (مستوى 3)' : 'Executive (Level 3)'}</option>
                </select>
              </div>

            </div>
          )}

          {/* TAB 3: Tenures & History */}
          {activeFormTab === 3 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldTotalWorkingYears', lang)}
                </label>
                <input
                  type="number"
                  value={formState.TotalWorkingYears === undefined ? '' : formState.TotalWorkingYears}
                  onChange={(e) => handleFieldChange('TotalWorkingYears', parseInt(e.target.value) || 0)}
                  className="input-select"
                  style={{ borderColor: errors.TotalWorkingYears ? 'var(--color-left)' : 'var(--border-color)' }}
                />
                {errors.TotalWorkingYears && (
                  <span style={{ color: 'var(--color-left)', fontSize: '11px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                    {getErrorText(errors.TotalWorkingYears, lang)}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldYearsAtCompany', lang)}
                </label>
                <input
                  type="number"
                  value={formState.YearsAtCompany === undefined ? '' : formState.YearsAtCompany}
                  onChange={(e) => handleFieldChange('YearsAtCompany', parseInt(e.target.value) || 0)}
                  className="input-select"
                  style={{ borderColor: errors.YearsAtCompany ? 'var(--color-left)' : 'var(--border-color)' }}
                />
                {errors.YearsAtCompany && (
                  <span style={{ color: 'var(--color-left)', fontSize: '11px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                    {getErrorText(errors.YearsAtCompany, lang)}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldYearsInCurrentRole', lang)}
                </label>
                <input
                  type="number"
                  value={formState.YearsInCurrentRole === undefined ? '' : formState.YearsInCurrentRole}
                  onChange={(e) => handleFieldChange('YearsInCurrentRole', parseInt(e.target.value) || 0)}
                  className="input-select"
                  style={{ borderColor: errors.YearsInCurrentRole ? 'var(--color-left)' : 'var(--border-color)' }}
                />
                {errors.YearsInCurrentRole && (
                  <span style={{ color: 'var(--color-left)', fontSize: '11px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                    {getErrorText(errors.YearsInCurrentRole, lang)}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldYearsSinceLastPromotion', lang)}
                </label>
                <input
                  type="number"
                  value={formState.YearsSinceLastPromotion === undefined ? '' : formState.YearsSinceLastPromotion}
                  onChange={(e) => handleFieldChange('YearsSinceLastPromotion', parseInt(e.target.value) || 0)}
                  className="input-select"
                  style={{ borderColor: errors.YearsSinceLastPromotion ? 'var(--color-left)' : 'var(--border-color)' }}
                />
                {errors.YearsSinceLastPromotion && (
                  <span style={{ color: 'var(--color-left)', fontSize: '11px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                    {getErrorText(errors.YearsSinceLastPromotion, lang)}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldYearsWithCurrManager', lang)}
                </label>
                <input
                  type="number"
                  value={formState.YearsWithCurrManager === undefined ? '' : formState.YearsWithCurrManager}
                  onChange={(e) => handleFieldChange('YearsWithCurrManager', parseInt(e.target.value) || 0)}
                  className="input-select"
                  style={{ borderColor: errors.YearsWithCurrManager ? 'var(--color-left)' : 'var(--border-color)' }}
                />
                {errors.YearsWithCurrManager && (
                  <span style={{ color: 'var(--color-left)', fontSize: '11px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                    {getErrorText(errors.YearsWithCurrManager, lang)}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldNumCompaniesWorked', lang)}
                </label>
                <input
                  type="number"
                  value={formState.NumCompaniesWorked === undefined ? '' : formState.NumCompaniesWorked}
                  onChange={(e) => handleFieldChange('NumCompaniesWorked', parseInt(e.target.value) || 0)}
                  className="input-select"
                  style={{ borderColor: errors.NumCompaniesWorked ? 'var(--color-left)' : 'var(--border-color)' }}
                />
                {errors.NumCompaniesWorked && (
                  <span style={{ color: 'var(--color-left)', fontSize: '11px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                    {getErrorText(errors.NumCompaniesWorked, lang)}
                  </span>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: Wellbeing & Feedback */}
          {activeFormTab === 4 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldJobSatisfaction', lang)}
                </label>
                <select
                  value={formState.JobSatisfaction || 3}
                  onChange={(e) => handleFieldChange('JobSatisfaction', parseInt(e.target.value))}
                  className="input-select"
                  style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
                >
                  <option value={1}>{translateValue('Low', lang)} (1)</option>
                  <option value={2}>{translateValue('Medium', lang)} (2)</option>
                  <option value={3}>{translateValue('High', lang)} (3)</option>
                  <option value={4}>{translateValue('Very High', lang)} (4)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldEnvironmentSatisfaction', lang)}
                </label>
                <select
                  value={formState.EnvironmentSatisfaction || 3}
                  onChange={(e) => handleFieldChange('EnvironmentSatisfaction', parseInt(e.target.value))}
                  className="input-select"
                  style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
                >
                  <option value={1}>{translateValue('Low', lang)} (1)</option>
                  <option value={2}>{translateValue('Medium', lang)} (2)</option>
                  <option value={3}>{translateValue('High', lang)} (3)</option>
                  <option value={4}>{translateValue('Very High', lang)} (4)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldRelationshipSatisfaction', lang)}
                </label>
                <select
                  value={formState.RelationshipSatisfaction || 3}
                  onChange={(e) => handleFieldChange('RelationshipSatisfaction', parseInt(e.target.value))}
                  className="input-select"
                  style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
                >
                  <option value={1}>{translateValue('Low', lang)} (1)</option>
                  <option value={2}>{translateValue('Medium', lang)} (2)</option>
                  <option value={3}>{translateValue('High', lang)} (3)</option>
                  <option value={4}>{translateValue('Very High', lang)} (4)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldJobInvolvement', lang)}
                </label>
                <select
                  value={formState.JobInvolvement || 3}
                  onChange={(e) => handleFieldChange('JobInvolvement', parseInt(e.target.value))}
                  className="input-select"
                  style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
                >
                  <option value={1}>{translateValue('Low', lang)} (1)</option>
                  <option value={2}>{translateValue('Medium', lang)} (2)</option>
                  <option value={3}>{translateValue('High', lang)} (3)</option>
                  <option value={4}>{translateValue('Very High', lang)} (4)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldWorkLifeBalance', lang)}
                </label>
                <select
                  value={formState.WorkLifeBalance || 3}
                  onChange={(e) => handleFieldChange('WorkLifeBalance', parseInt(e.target.value))}
                  className="input-select"
                  style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
                >
                  <option value={1}>{translateValue('Poor', lang)} (1)</option>
                  <option value={2}>{translateValue('Fair', lang)} (2)</option>
                  <option value={3}>{translateValue('Good', lang)} (3)</option>
                  <option value={4}>{translateValue('Excellent', lang)} (4)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldPerformanceRating', lang)}
                </label>
                <select
                  value={formState.PerformanceRating || 3}
                  onChange={(e) => handleFieldChange('PerformanceRating', parseInt(e.target.value))}
                  className="input-select"
                  style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
                >
                  <option value={3}>{isRtl ? 'ممتاز (3)' : 'Excellent (3)'}</option>
                  <option value={4}>{isRtl ? 'متميز (4)' : 'Outstanding (4)'}</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {t('fieldTrainingTimesLastYear', lang)}
                </label>
                <input
                  type="number"
                  value={formState.TrainingTimesLastYear === undefined ? '' : formState.TrainingTimesLastYear}
                  onChange={(e) => handleFieldChange('TrainingTimesLastYear', parseInt(e.target.value) || 0)}
                  className="input-select"
                  style={{ borderColor: errors.TrainingTimesLastYear ? 'var(--color-left)' : 'var(--border-color)' }}
                />
                {errors.TrainingTimesLastYear && (
                  <span style={{ color: 'var(--color-left)', fontSize: '11px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                    {getErrorText(errors.TrainingTimesLastYear, lang)}
                  </span>
                )}
              </div>

            </div>
          )}

          {/* Form Action Controls (Bottom) */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            {isEditMode ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'transparent',
                    color: 'var(--text-main)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {t('btnCancel', lang)}
                </button>
                <button
                  id="btn-submit-form"
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--gradient-primary)',
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit',
                    transition: 'all 0.2s',
                    boxShadow: 'var(--shadow-main)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.15)'}
                  onMouseOut={(e) => e.currentTarget.style.filter = 'none'}
                >
                  {t('btnUpdate', lang)}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setFormState(emptyFormState(maxEmpNum));
                    setErrors({});
                  }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'transparent',
                    color: 'var(--text-main)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {isRtl ? 'إعادة تعيين' : 'Reset Form'}
                </button>
                <button
                  id="btn-submit-form"
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--gradient-primary)',
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit',
                    transition: 'all 0.2s',
                    boxShadow: 'var(--shadow-main)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.15)'}
                  onMouseOut={(e) => e.currentTarget.style.filter = 'none'}
                >
                  {t('btnCreate', lang)}
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      {/* 3. Confirm Delete Overlay Modal */}
      {confirmDeleteId && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div 
            className="glass-panel-noclick animate-fade-in" 
            style={{ 
              padding: '32px', 
              maxWidth: '400px', 
              width: '90%',
              display: 'flex', 
              flexDirection: 'column', 
              gap: '20px', 
              textAlign: 'center',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <AlertCircle size={40} style={{ color: 'var(--color-left)', alignSelf: 'center' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
              {t('lblConfirmDeleteTitle', lang)}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit', lineHeight: 1.5 }}>
              {t('lblConfirmDeleteMsg', lang).replace('{id}', confirmDeleteId)}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '10px' }}>
              <button 
                onClick={() => setConfirmDeleteId(null)}
                style={{
                  padding: '10px 20px', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border-color)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit'
                }}
              >
                {t('btnCancel', lang)}
              </button>
              <button 
                onClick={handleDeleteExecute}
                style={{
                  padding: '10px 20px', 
                  borderRadius: '8px', 
                  border: 'none',
                  background: 'var(--color-left)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit'
                }}
              >
                {t('btnDelete', lang)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Action Toast Message */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: isRtl ? 'auto' : '24px',
          left: isRtl ? '24px' : 'auto',
          backgroundColor: 'rgba(18, 18, 24, 0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--color-stayed)',
          borderRadius: '8px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: 'var(--text-main)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 999
        }}>
          <CheckCircle2 size={18} style={{ color: 'var(--color-stayed)' }} />
          <span style={{ fontSize: '13px', fontWeight: 500, fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {toast}
          </span>
        </div>
      )}

    </div>
  );
};
