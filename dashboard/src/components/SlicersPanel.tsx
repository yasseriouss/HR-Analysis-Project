import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { t, translateValue } from '../utils/i18n';
import type { Language } from '../utils/i18n';

export interface FilterState {
  department: string;
  jobRole: string;
  gender: string;
  businessTravel: string;
  attrition: string;
}

interface SlicersPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  filteredCount: number;
  totalCount: number;
  lang: Language;
}

export const SlicersPanel: React.FC<SlicersPanelProps> = ({
  filters,
  setFilters,
  resetFilters,
  filteredCount,
  totalCount,
  lang
}) => {
  const isRtl = lang === 'ar';

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Static options based on the dataset mapping
  const departments = ['Research & Development', 'Sales', 'Human Resources'];
  
  const jobRoles = [
    'Research Scientist',
    'Laboratory Technician',
    'Manufacturing Director',
    'Healthcare Representative',
    'Manager',
    'Research Director',
    'Sales Executive',
    'Sales Representative',
    'Human Resources'
  ];

  const genders = ['Male', 'Female'];
  
  const travelOptions = [
    { value: 'Travel_Rarely', label: 'Travel_Rarely' },
    { value: 'Travel_Frequently', label: 'Travel_Frequently' },
    { value: 'Non-Travel', label: 'Non-Travel' }
  ];

  const attritionOptions = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
  ];

  const hasActiveFilters = Object.values(filters).some(val => val !== 'All');

  // Format count text
  const countText = t('filterCountText', lang)
    .replace('{filtered}', String(filteredCount))
    .replace('{total}', String(totalCount));

  return (
    <div 
      className="glass-panel-noclick"
      style={{
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: '14px',
        width: '100%'
      }}
    >
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '10px',
          width: '100%'
        }}
      >
        <div style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center' }}>
          <Filter size={18} />
        </div>
        <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
          {t('activeFilters', lang)}
        </span>
        <span 
          style={{
            fontSize: '11px',
            backgroundColor: 'hsla(185, 90%, 50%, 0.1)',
            color: 'var(--accent-cyan)',
            padding: '3px 8px',
            borderRadius: '12px',
            fontWeight: 600,
            fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit'
          }}
        >
          {countText}
        </span>
      </div>

      <div 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '16px 12px', 
          alignItems: 'flex-end',
          width: '100%'
        }}
      >
        {/* Department Slicer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 500, fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('slicerDept', lang)}
          </label>
          <select
            id="slicer-department"
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="input-select"
            style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
          >
            <option value="All">{t('allDepts', lang)}</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{translateValue(dept, lang)}</option>
            ))}
          </select>
        </div>

        {/* Job Role Slicer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 500, fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('slicerRole', lang)}
          </label>
          <select
            id="slicer-job-role"
            value={filters.jobRole}
            onChange={(e) => handleFilterChange('jobRole', e.target.value)}
            className="input-select"
            style={{ maxWidth: '200px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
          >
            <option value="All">{t('allRoles', lang)}</option>
            {jobRoles.map((role) => (
              <option key={role} value={role}>{translateValue(role, lang)}</option>
            ))}
          </select>
        </div>

        {/* Gender Slicer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 500, fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('slicerGender', lang)}
          </label>
          <select
            id="slicer-gender"
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
            className="input-select"
            style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
          >
            <option value="All">{t('allGenders', lang)}</option>
            {genders.map((gen) => (
              <option key={gen} value={gen}>{translateValue(gen, lang)}</option>
            ))}
          </select>
        </div>

        {/* Business Travel Slicer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 500, fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('slicerTravel', lang)}
          </label>
          <select
            id="slicer-business-travel"
            value={filters.businessTravel}
            onChange={(e) => handleFilterChange('businessTravel', e.target.value)}
            className="input-select"
            style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
          >
            <option value="All">{t('allTravels', lang)}</option>
            {travelOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{translateValue(opt.label, lang)}</option>
            ))}
          </select>
        </div>

        {/* Attrition Slicer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 500, fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('slicerAttrition', lang)}
          </label>
          <select
            id="slicer-attrition"
            value={filters.attrition}
            onChange={(e) => handleFilterChange('attrition', e.target.value)}
            className="input-select"
            style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
          >
            <option value="All">{t('allAttritions', lang)}</option>
            {attritionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{translateValue(opt.label, lang)}</option>
            ))}
          </select>
        </div>

        {/* Reset Slicers Button */}
        {hasActiveFilters && (
          <button
            id="slicer-reset-button"
            onClick={resetFilters}
            style={{
              alignSelf: 'flex-end',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'hsla(342, 85%, 55%, 0.1)',
              color: 'var(--color-left)',
              border: '1px solid hsla(342, 85%, 55%, 0.2)',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: isRtl ? 'Tajawal, sans-serif' : 'var(--font-family)',
              fontSize: '13px',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              marginTop: '15px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'hsla(342, 85%, 55%, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'hsla(342, 85%, 55%, 0.1)';
            }}
          >
            <RotateCcw size={14} />
            {t('resetBtn', lang)}
          </button>
        )}
      </div>
    </div>
  );
};
export default SlicersPanel;
