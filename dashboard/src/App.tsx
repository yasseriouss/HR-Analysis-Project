import React, { useState, useMemo, useEffect } from 'react';
import hrDataRaw from './data/hr_data.json';
import type { Employee } from './types/employee';
import { Sidebar } from './components/Sidebar';
import { SlicersPanel } from './components/SlicersPanel';
import type { FilterState } from './components/SlicersPanel';
import { OverviewTab } from './components/OverviewTab';
import { AttritionTab } from './components/AttritionTab';
import { SalaryTab } from './components/SalaryTab';
import { SatisfactionTab } from './components/SatisfactionTab';
import { PerformanceTab } from './components/PerformanceTab';
import { PayrollTab } from './components/PayrollTab';
import { ContractsTab } from './components/ContractsTab';
import { GratuityCalculator } from './components/GratuityCalculator';
import { ShiftManagement } from './components/ShiftManagement';
import { ESSPortal } from './components/ESSPortal';
import { ExpensesTab } from './components/ExpensesTab';
import { OrgChart } from './components/OrgChart';
import { MSSPortal } from './components/MSSPortal';
import { LifecycleTab } from './components/LifecycleTab';
import { ReportsTab } from './components/ReportsTab';
import { ScorecardTab } from './components/ScorecardTab';
import { DiversityTab } from './components/DiversityTab';
import { WorkforceAnalytics } from './components/WorkforceAnalytics';
import { RecruitmentTab } from './components/RecruitmentTab';
import { PerformanceReview } from './components/PerformanceReview';
import { TrainingTab } from './components/TrainingTab';
import { HRToolsTab } from './components/HRToolsTab';
import { NotificationsTab } from './components/NotificationsTab';
import { DocumentsTab } from './components/DocumentsTab';
import { PredictorTab } from './components/PredictorTab';
import { DataEntryTab } from './components/DataEntryTab';
import { AttendanceTab, AdvancesTab, LeavesTab, VehiclesTab, ViolationsTab, SystemUsersTab } from './components/AccessDbTabs';
import ErrorBoundary from './components/ErrorBoundary';
import { withPermission } from './components/withPermission';
import { t } from './utils/i18n';
import type { Language } from './utils/i18n';
import { Languages } from 'lucide-react';
import { ThemeSelector } from './components/ThemeSelector';

// Cast raw JSON data to our type-safe Employee array
const hrData = hrDataRaw as Employee[];

// Load initial employees list with localStorage persistence
const loadInitialEmployees = (): Employee[] => {
  try {
    const cached = localStorage.getItem('hr_pulse_employees');
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.error('Failed to load employees from cache', e);
  }
  return hrData;
};

export const App: React.FC = () => {
  // Localization state
  const [lang, setLang] = useState<Language>('en');

  // State-driven employees list supporting CRUD
  const [employees, setEmployees] = useState<Employee[]>(loadInitialEmployees);

  // Sync employees to localStorage when modified
  useEffect(() => {
    try {
      localStorage.setItem('hr_pulse_employees', JSON.stringify(employees));
    } catch (e) {
      console.error('Failed to save employees to cache', e);
    }
  }, [employees]);

  // Sync HTML attributes on language change
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Global Filter Slicer State
  const initialFilters: FilterState = {
    department: 'All',
    jobRole: 'All',
    gender: 'All',
    businessTravel: 'All',
    attrition: 'All'
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  // High-performance dynamic filtering engine
  const filteredData = useMemo(() => {
    return employees.filter((emp) => {
      if (filters.department !== 'All' && emp.Department !== filters.department) {
        return false;
      }
      if (filters.jobRole !== 'All' && emp.JobRole !== filters.jobRole) {
        return false;
      }
      if (filters.gender !== 'All' && emp.Gender !== filters.gender) {
        return false;
      }
      if (filters.businessTravel !== 'All' && emp.BusinessTravel !== filters.businessTravel) {
        return false;
      }
      if (filters.attrition !== 'All' && emp.Attrition !== filters.attrition) {
        return false;
      }
      return true;
    });
  }, [filters, employees]);

  const isRtl = lang === 'ar';

  return (
    <div className="app-container" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
        lang={lang}
      />

      {/* Main Panel */}
      <main className="main-content" style={{ padding: '24px' }}>
        {/* Page Header & Language Switcher */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '16px',
            marginBottom: '8px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span 
              style={{ 
                fontSize: '11px', 
                textTransform: 'uppercase', 
                letterSpacing: isRtl ? 'normal' : '0.1em', 
                color: 'var(--accent-cyan)',
                fontWeight: 700
              }}
            >
              {t('appSubtitle', lang)}
            </span>
            <h1 
              style={{ 
                fontSize: '28px', 
                fontWeight: 800, 
                color: 'var(--text-main)',
                fontFamily: isRtl ? 'var(--font-family-ar)' : 'var(--font-family)'
              }}
            >
              {t('appTitle', lang)}
            </h1>
          </div>

          {/* Theme Selector - RTL aware positioning */}
          <ThemeSelector lang={lang} />

          {/* Premium Language Switcher Button */}
          <button
            id="lang-switcher-button"
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              padding: '10px 18px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontFamily: isRtl ? 'var(--font-family-ar)' : 'var(--font-family)',
              fontWeight: 600,
              fontSize: '14px',
              boxShadow: 'var(--shadow-main)',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(8px)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
              e.currentTarget.style.borderColor = 'var(--accent-purple)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-card)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <Languages size={16} style={{ color: 'var(--accent-cyan)' }} />
            <span>{t('langBtn', lang)}</span>
          </button>
        </div>

        {/* Dynamic Slicers Panel (Excluding ML Predictor and Data Entry tabs) */}
        {activeTab !== 'predictor' && activeTab !== 'dataentry' && (
          <SlicersPanel 
            filters={filters} 
            setFilters={setFilters} 
            resetFilters={resetFilters} 
            filteredCount={filteredData.length} 
            totalCount={employees.length} 
            lang={lang}
          />
        )}

        {/* Dynamic Active Tab Renderer */}
        <div id="active-tab-content" style={{ flex: 1, marginTop: '16px' }}>
          {withPermission({ permission: 'view_analytics', fallback: null, children: <><OverviewTab data={filteredData} lang={lang} /><AttritionTab data={filteredData} lang={lang} /><SalaryTab data={filteredData} lang={lang} /></> })}
          {withPermission({ permission: 'view_analytics', fallback: null, children: <><SatisfactionTab data={filteredData} lang={lang} /><PerformanceTab data={filteredData} lang={lang} /></> })}
          {withPermission({ permission: 'manage_payroll', fallback: null, children: <><PayrollTab data={filteredData} lang={lang} /><ContractsTab data={filteredData} lang={lang} /></> })}
          {activeTab === 'gratuity' && <GratuityCalculator data={filteredData} lang={lang} />}
          {activeTab === 'shifts' && <ShiftManagement lang={lang} />}
          {activeTab === 'ess' && <ESSPortal data={filteredData} lang={lang} />}
          {activeTab === 'expenses' && <ExpensesTab data={filteredData} lang={lang} />}
          {activeTab === 'orgchart' && <OrgChart data={filteredData} lang={lang} />}
          {activeTab === 'mss' && <MSSPortal data={filteredData} lang={lang} />}
          {activeTab === 'lifecycle' && <LifecycleTab data={filteredData} lang={lang} />}
          {activeTab === 'reports' && <ReportsTab data={filteredData} lang={lang} />}
          {activeTab === 'scorecard' && <ScorecardTab data={filteredData} lang={lang} />}
          {activeTab === 'diversity' && <DiversityTab data={filteredData} lang={lang} />}
          {activeTab === 'workforce' && <WorkforceAnalytics data={filteredData} lang={lang} />}
          {activeTab === 'recruitment' && <RecruitmentTab lang={lang} />}
          {activeTab === 'perfreview' && <PerformanceReview data={filteredData} lang={lang} />}
          {activeTab === 'training' && <TrainingTab data={filteredData} lang={lang} />}
          {activeTab === 'hrtools' && <HRToolsTab lang={lang} />}
          {activeTab === 'notifications' && <NotificationsTab lang={lang} />}
          {activeTab === 'documents' && <DocumentsTab lang={lang} />}
          {activeTab === 'predictor' && <PredictorTab data={employees} lang={lang} />}
          {activeTab === 'dataentry' && <DataEntryTab data={employees} setData={setEmployees} lang={lang} />}
          {/* Access Database Integration Tabs */}
          <ErrorBoundary lang={lang}>
            {withPermission({ permission: 'manage_attendance', fallback: null, children: <AttendanceTab lang={lang} /> })}
            {withPermission({ permission: 'approve_expenses', fallback: null, children: <AdvancesTab lang={lang} /> })}
            {withPermission({ permission: 'manage_leaves', fallback: null, children: <LeavesTab lang={lang} /> })}
            {withPermission({ permission: 'manage_vehicles', fallback: null, children: <VehiclesTab lang={lang} /> })}
            {withPermission({ permission: 'manage_violations', fallback: null, children: <ViolationsTab lang={lang} /> })}
            {withPermission({ permission: 'manage_users', fallback: null, children: <SystemUsersTab lang={lang} /> })}
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default App;
