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
import { PredictorTab } from './components/PredictorTab';
import { DataEntryTab } from './components/DataEntryTab';
import { t } from './utils/i18n';
import type { Language } from './utils/i18n';
import { Languages } from 'lucide-react';

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
                fontFamily: isRtl ? 'Tajawal, sans-serif' : 'Outfit, sans-serif'
              }}
            >
              {t('appTitle', lang)}
            </h1>
          </div>

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
              fontFamily: isRtl ? 'Tajawal, sans-serif' : 'var(--font-family)',
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
          {activeTab === 'overview' && <OverviewTab data={filteredData} lang={lang} />}
          {activeTab === 'attrition' && <AttritionTab data={filteredData} lang={lang} />}
          {activeTab === 'salary' && <SalaryTab data={filteredData} lang={lang} />}
          {activeTab === 'satisfaction' && <SatisfactionTab data={filteredData} lang={lang} />}
          {activeTab === 'performance' && <PerformanceTab data={filteredData} lang={lang} />}
          {activeTab === 'predictor' && <PredictorTab data={employees} lang={lang} />}
          {activeTab === 'dataentry' && <DataEntryTab data={employees} setData={setEmployees} lang={lang} />}
        </div>
      </main>
    </div>
  );
};

export default App;
