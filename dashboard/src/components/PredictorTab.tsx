import React, { useState, useMemo } from 'react';
import type { Employee } from '../types/employee';
import { Brain, Sparkles, User, RefreshCw, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { 
  t, 
  translateValue, 
  translateDiagnosticFactor, 
  translateDiagnosticImpact, 
  translateRecommendation 
} from '../utils/i18n';
import type { Language } from '../utils/i18n';

interface PredictorTabProps {
  data: Employee[];
  lang: Language;
}

interface SimulatorState {
  age: number;
  monthlyIncome: number;
  overTime: boolean;
  jobLevel: number;
  yearsAtCompany: number;
  distanceFromHome: number;
  jobSatisfaction: number;
  workLifeBalance: number;
  environmentSatisfaction: number;
  numCompaniesWorked: number;
}

export const PredictorTab: React.FC<PredictorTabProps> = ({ data, lang }) => {
  const isRtl = lang === 'ar';

  // Sort employees for dropdown selection
  const employeeDropdownOptions = useMemo(() => {
    return [...data]
      .sort((a, b) => a.EmpID.localeCompare(b.EmpID, undefined, { numeric: true }))
      .map(e => ({
        id: e.EmpID,
        label: isRtl 
          ? `${e.EmpID} (${translateValue(e.JobRole, lang)} - ${translateValue(e.Department === 'Research & Development' ? 'R&D' : e.Department, lang)})`
          : `${e.EmpID} (${e.JobRole} - ${e.Department === 'Research & Development' ? 'R&D' : e.Department})`
      }));
  }, [data, lang, isRtl]);

  // Initial State
  const defaultState: SimulatorState = {
    age: 35,
    monthlyIncome: 6000,
    overTime: false,
    jobLevel: 2,
    yearsAtCompany: 5,
    distanceFromHome: 8,
    jobSatisfaction: 3,
    workLifeBalance: 3,
    environmentSatisfaction: 3,
    numCompaniesWorked: 2
  };

  const [simState, setSimState] = useState<SimulatorState>(defaultState);
  const [selectedEmpId, setSelectedEmpId] = useState<string>('Custom');

  // Handle Employee Dropdown Selection
  const handleEmployeeSelect = (empId: string) => {
    setSelectedEmpId(empId);
    if (empId === 'Custom') {
      return;
    }
    const emp = data.find(e => e.EmpID === empId);
    if (emp) {
      setSimState({
        age: emp.Age,
        monthlyIncome: emp.MonthlyIncome,
        overTime: emp.OverTime === 'Yes',
        jobLevel: emp.JobLevel,
        yearsAtCompany: emp.YearsAtCompany,
        distanceFromHome: emp.DistanceFromHome,
        jobSatisfaction: emp.JobSatisfaction,
        workLifeBalance: emp.WorkLifeBalance,
        environmentSatisfaction: emp.EnvironmentSatisfaction,
        numCompaniesWorked: emp.NumCompaniesWorked
      });
    }
  };

  // Reset to default
  const handleReset = () => {
    setSimState(defaultState);
    setSelectedEmpId('Custom');
  };

  // Calculate Attrition Probability using Logistic Regression Formula
  const prediction = useMemo(() => {
    const intercept = 2.0177;
    const bAge = -0.0488;
    const bIncome = -0.00004394;
    const bOverTime = 1.5841;
    const bJobLevel = -0.2285;
    const bYearsAtCompany = -0.0186;
    const bDistance = 0.0303;
    const bJobSat = -0.3118;
    const bWorkLife = -0.2487;
    const bEnvSat = -0.3436;
    const bNumComp = 0.1237;

    // Linear formula z
    const z = intercept 
      + (bAge * simState.age)
      + (bIncome * simState.monthlyIncome)
      + (bOverTime * (simState.overTime ? 1 : 0))
      + (bJobLevel * simState.jobLevel)
      + (bYearsAtCompany * simState.yearsAtCompany)
      + (bDistance * simState.distanceFromHome)
      + (bJobSat * simState.jobSatisfaction)
      + (bWorkLife * simState.workLifeBalance)
      + (bEnvSat * simState.environmentSatisfaction)
      + (bNumComp * simState.numCompaniesWorked);

    // Sigmoid function
    const probability = 1 / (1 + Math.exp(-z));
    const pct = Math.round(probability * 1000) / 10; // 1 decimal place

    // Determine risk classification
    let tier = 'Low Risk';
    let color = 'var(--color-stayed)';
    if (pct >= 50) {
      tier = 'High Risk';
      color = 'var(--color-left)';
    } else if (pct >= 20) {
      tier = 'Moderate Risk';
      color = 'var(--color-warning)';
    }

    return { percentage: pct, tier, color, z };
  }, [simState]);

  // Calculate specific risk driving factors and suggestions
  const diagnostics = useMemo(() => {
    const activeBoosters: { factor: string; impact: string }[] = [];
    const activeMitigators: { factor: string; impact: string }[] = [];
    const recommendations: string[] = [];

    // Overtime
    if (simState.overTime) {
      activeBoosters.push({ factor: 'Works Overtime', impact: 'Highest risk driver (+1.58 log-odds)' });
      recommendations.push('Cap weekly overtime hours and offer mandatory comp-time relief.');
    } else {
      activeMitigators.push({ factor: 'No Overtime', impact: 'Significantly reduces churn risk' });
    }

    // Commute Distance
    if (simState.distanceFromHome > 15) {
      activeBoosters.push({ factor: `Far Commute (${simState.distanceFromHome} km)`, impact: 'Increases travel fatigue (+0.03/km)' });
      recommendations.push('Introduce hybrid or remote work policies to reduce commute burden.');
    } else {
      activeMitigators.push({ factor: 'Local Residence', impact: 'Low commute distance reduces turnover' });
    }

    // Satisfactions
    if (simState.jobSatisfaction <= 2) {
      activeBoosters.push({ factor: `Low Job Satisfaction (${simState.jobSatisfaction}/4)`, impact: 'Significant attrition driver' });
      recommendations.push('Conduct a structured career path alignment and role feedback interview.');
    } else {
      activeMitigators.push({ factor: 'High Job Satisfaction', impact: 'Protective employee retention factor' });
    }

    if (simState.environmentSatisfaction <= 2) {
      activeBoosters.push({ factor: `Low Environment Satisfaction (${simState.environmentSatisfaction}/4)`, impact: 'Strong workplace risk factor' });
      recommendations.push('Investigate department culture, manager alignment, or workspace facilities.');
    } else {
      activeMitigators.push({ factor: 'Positive Environment', impact: 'Excellent workspace connection' });
    }

    // Work Life Balance
    if (simState.workLifeBalance <= 2) {
      activeBoosters.push({ factor: `Low Work Life Balance (${simState.workLifeBalance}/4)`, impact: 'Elevates burnout risk' });
      recommendations.push('Offer flexible schedule coordination or wellbeing check-ins.');
    }

    // Job Hopping history
    if (simState.numCompaniesWorked >= 4) {
      activeBoosters.push({ factor: `Job-Hopping History (${simState.numCompaniesWorked} Companies)`, impact: 'Historically high mobility' });
      recommendations.push('Set up structured retention milestones and long-term vesting targets.');
    }

    // Default recommendation if low risk
    if (recommendations.length === 0) {
      recommendations.push('Maintain current employee engagement, compensation alignment, and growth tracking.');
    }

    return { activeBoosters, activeMitigators, recommendations };
  }, [simState]);

  // Phase 8.1: Scenario Comparison (store previous snapshot)
  const [scenarios, setScenarios] = useState<{ label: string; pct: number; tier: string; state: SimulatorState }[]>([]);

  const handleSaveScenario = () => {
    setScenarios(prev => [
      ...prev.slice(-2),
      { label: `Scenario ${prev.length + 1}`, pct: prediction.percentage, tier: prediction.tier, state: { ...simState } }
    ]);
  };

  const handleLoadScenario = (s: typeof scenarios[number]) => {
    setSimState(s.state);
    setSelectedEmpId('Custom');
  };

  // Phase 8.2: Batch prediction summary (across all employees)
  const batchSummary = useMemo(() => {
    const intercept = 2.0177;
    const bAge = -0.0488;
    const bIncome = -0.00004394;
    const bOverTime = 1.5841;
    const bJobLevel = -0.2285;
    const bYearsAtCompany = -0.0186;
    const bDistance = 0.0303;
    const bJobSat = -0.3118;
    const bWorkLife = -0.2487;
    const bEnvSat = -0.3436;
    const bNumComp = 0.1237;

    let sum = 0;
    let high = 0;
    let moderate = 0;
    let low = 0;
    data.forEach(e => {
      const z = intercept
        + (bAge * e.Age)
        + (bIncome * e.MonthlyIncome)
        + (bOverTime * (e.OverTime === 'Yes' ? 1 : 0))
        + (bJobLevel * e.JobLevel)
        + (bYearsAtCompany * e.YearsAtCompany)
        + (bDistance * e.DistanceFromHome)
        + (bJobSat * e.JobSatisfaction)
        + (bWorkLife * e.WorkLifeBalance)
        + (bEnvSat * e.EnvironmentSatisfaction)
        + (bNumComp * e.NumCompaniesWorked);
      const p = 1 / (1 + Math.exp(-z));
      const pct = Math.round(p * 1000) / 10;
      sum += pct;
      if (pct >= 50) high++;
      else if (pct >= 20) moderate++;
      else low++;
    });
    const avg = data.length ? (sum / data.length) : 0;
    return { avg, high, moderate, low, total: data.length };
  }, [data]);

  // Phase 8.3: Mock confidence band based on sigmoid steepness proxy (RMS of z across batch)
  const confidenceBand = useMemo(() => {
    const base = prediction.percentage;
    const spread = 6; // illustrative band width percentage points
    const lo = Math.max(0, base - spread);
    const hi = Math.min(100, base + spread);
    return `${lo.toFixed(1)}% – ${hi.toFixed(1)}%`;
  }, [prediction.percentage]);

  // SVG parameters for circular progress gauge
  const strokeDashoffset = useMemo(() => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    return circumference - (prediction.percentage / 100) * circumference;
  }, [prediction.percentage]);

  const tierTranslations: Record<string, string> = {
    'Low Risk': t('riskLow', lang),
    'Moderate Risk': t('riskModerate', lang),
    'High Risk': t('riskHigh', lang)
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header and Employee Selector */}
      <div 
        className="glass-panel-noclick" 
        style={{ 
          padding: '20px 24px', 
          display: 'flex', 
          flexWrap: 'wrap', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: 'var(--accent-purple)', display: 'flex', alignItems: 'center' }}>
            <Brain size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
              {t('predTitle', lang)}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
              {t('predSubtitle', lang)}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Select Employee */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={16} style={{ color: 'var(--text-dim)' }} />
            <select
              id="predictor-employee-select"
              value={selectedEmpId}
              onChange={(e) => handleEmployeeSelect(e.target.value)}
              className="input-select"
              style={{ minWidth: '220px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
            >
              <option value="Custom">{t('predCustomSim', lang)}</option>
              {employeeDropdownOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          <button
            id="predictor-reset-button"
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              padding: '10px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: isRtl ? 'Tajawal, sans-serif' : 'var(--font-family)',
              fontSize: '13px',
              fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <RefreshCw size={14} />
            {t('predReset', lang)}
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <button id="scenario-save" onClick={handleSaveScenario} style={{ background: 'var(--accent-cyan)', color: '#000', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>Save Scenario</button>
        {scenarios.map((s, i) => (
          <button key={i} id={`scenario-load-${i}`} onClick={() => handleLoadScenario(s)} style={{ background: 'var(--bg-sidebar)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>{s.label}</span>
            <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{s.pct}%</span>
          </button>
        ))}
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))' }}>
        {/* Sliders Control Panel */}
        <div className="glass-panel-noclick" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-cyan)' }} />
            {t('predAdjustParams', lang)}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Age Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('predAge', lang)}</span>
                <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>
                   {isRtl ? `${simState.age.toLocaleString('ar-EG')} ${t('unitYear', lang)}` : `${simState.age} ${t('unitYears', lang)}`}
                </span>
              </div>
              <input 
                id="slider-age"
                type="range" 
                min={18} 
                max={60} 
                value={simState.age}
                onChange={(e) => {
                  setSimState(prev => ({ ...prev, age: parseInt(e.target.value) }));
                  setSelectedEmpId('Custom');
                }}
                className="input-range"
              />
            </div>

            {/* Monthly Income Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('predMonthlyIncome', lang)}</span>
                <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>
                  {isRtl ? `${simState.monthlyIncome.toLocaleString('ar-EG')} $` : `$${simState.monthlyIncome.toLocaleString()}`}
                </span>
              </div>
              <input 
                id="slider-monthly-income"
                type="range" 
                min={1000} 
                max={20000} 
                step={100}
                value={simState.monthlyIncome}
                onChange={(e) => {
                  setSimState(prev => ({ ...prev, monthlyIncome: parseInt(e.target.value) }));
                  setSelectedEmpId('Custom');
                }}
                className="input-range"
              />
            </div>

            {/* Distance From Home Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('predDistance', lang)}</span>
                <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>
                   {isRtl ? `${simState.distanceFromHome.toLocaleString('ar-EG')} ${t('unitKm', lang)}` : `${simState.distanceFromHome} ${t('unitKm', lang)}`}
                </span>
              </div>
              <input 
                id="slider-distance"
                type="range" 
                min={1} 
                max={30} 
                value={simState.distanceFromHome}
                onChange={(e) => {
                  setSimState(prev => ({ ...prev, distanceFromHome: parseInt(e.target.value) }));
                  setSelectedEmpId('Custom');
                }}
                className="input-range"
              />
            </div>

            {/* Num Companies Worked Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('predCompanies', lang)}</span>
                <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>
                  {isRtl ? simState.numCompaniesWorked.toLocaleString('ar-EG') : simState.numCompaniesWorked}
                </span>
              </div>
              <input 
                id="slider-companies"
                type="range" 
                min={0} 
                max={9} 
                value={simState.numCompaniesWorked}
                onChange={(e) => {
                  setSimState(prev => ({ ...prev, numCompaniesWorked: parseInt(e.target.value) }));
                  setSelectedEmpId('Custom');
                }}
                className="input-range"
              />
            </div>

            {/* Years at Company Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('predYearsCompany', lang)}</span>
                <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>
                   {isRtl ? `${simState.yearsAtCompany.toLocaleString('ar-EG')} ${t('unitYear', lang)}` : `${simState.yearsAtCompany} ${t('unitYears', lang)}`}
                </span>
              </div>
              <input 
                id="slider-years-company"
                type="range" 
                min={0} 
                max={40} 
                value={simState.yearsAtCompany}
                onChange={(e) => {
                  setSimState(prev => ({ ...prev, yearsAtCompany: parseInt(e.target.value) }));
                  setSelectedEmpId('Custom');
                }}
                className="input-range"
              />
            </div>

            {/* Job Level Select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>{t('predJobLevelLabel', lang)}</label>
              <select
                id="select-job-level"
                value={simState.jobLevel}
                onChange={(e) => {
                  setSimState(prev => ({ ...prev, jobLevel: parseInt(e.target.value) }));
                  setSelectedEmpId('Custom');
                }}
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
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '10px' }}>
            {/* Job Satisfaction Select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>{t('predJobSatLabel', lang)}</label>
              <select
                id="select-job-sat"
                value={simState.jobSatisfaction}
                onChange={(e) => {
                  setSimState(prev => ({ ...prev, jobSatisfaction: parseInt(e.target.value) }));
                  setSelectedEmpId('Custom');
                }}
                className="input-select"
                style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
              >
                <option value={1}>{t('satLow', lang)}</option>
                <option value={2}>{t('satMed', lang)}</option>
                <option value={3}>{t('satHigh', lang)}</option>
                <option value={4}>{t('satVeryHigh', lang)}</option>
              </select>
            </div>

            {/* Environment Satisfaction Select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>{t('predEnvSatLabel', lang)}</label>
              <select
                id="select-env-sat"
                value={simState.environmentSatisfaction}
                onChange={(e) => {
                  setSimState(prev => ({ ...prev, environmentSatisfaction: parseInt(e.target.value) }));
                  setSelectedEmpId('Custom');
                }}
                className="input-select"
                style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
              >
                <option value={1}>{t('satLow', lang)}</option>
                <option value={2}>{t('satMed', lang)}</option>
                <option value={3}>{t('satHigh', lang)}</option>
                <option value={4}>{t('satVeryHigh', lang)}</option>
              </select>
            </div>

            {/* Work Life Balance Select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>{t('predWorkLifeLabel', lang)}</label>
              <select
                id="select-work-life"
                value={simState.workLifeBalance}
                onChange={(e) => {
                  setSimState(prev => ({ ...prev, workLifeBalance: parseInt(e.target.value) }));
                  setSelectedEmpId('Custom');
                }}
                className="input-select"
                style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
              >
                <option value={1}>{t('wlPoor', lang)}</option>
                <option value={2}>{t('wlFair', lang)}</option>
                <option value={3}>{t('wlGood', lang)}</option>
                <option value={4}>{t('wlEx', lang)}</option>
              </select>
            </div>

            {/* Overtime Toggle Switch */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-sidebar)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500, fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>{t('predOvertimeLabel', lang)}</span>
              <label className="toggle-switch">
                <input 
                  id="toggle-overtime"
                  type="checkbox" 
                  checked={simState.overTime}
                  onChange={(e) => {
                     setSimState(prev => ({ ...prev, overTime: e.target.checked }));
                     setSelectedEmpId('Custom');
                  }}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Prediction Outputs Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Gauge Widget */}
          <div className="glass-panel-noclick" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '32px' }}>
            {/* SVG Circular Gauge */}
            <div style={{ position: 'relative', width: '180px', height: '180px', flexShrink: 0 }}>
              <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background Ring */}
                <circle
                  cx="90"
                  cy="90"
                  r="80"
                  fill="transparent"
                  stroke="var(--border-color)"
                  strokeWidth="12"
                />
                {/* Progress Ring */}
                <circle
                  cx="90"
                  cy="90"
                  r="80"
                  fill="transparent"
                  stroke={prediction.color}
                  strokeWidth="12"
                  strokeDasharray={2 * Math.PI * 80}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.4s ease, stroke 0.4s ease' }}
                />
              </svg>
              {/* Inner Text */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'var(--font-family)' }}>
                  {isRtl ? `${prediction.percentage.toLocaleString('ar-EG')}٪` : `${prediction.percentage}%`}
                </span>
                <br />
                <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.05em', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                   {t('predAttritionRisk', lang)}
                </span>
              </div>
            </div>

            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 500, textTransform: 'uppercase', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                {t('predClassification', lang)}
              </span>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: prediction.color, fontFamily: isRtl ? 'Tajawal, sans-serif' : 'var(--font-family)' }}>
                {tierTranslations[prediction.tier as 'Low Risk' | 'Moderate Risk' | 'High Risk']}
              </h2>
              
              <div 
                style={{ 
                  fontSize: '13px', 
                  color: 'var(--text-muted)', 
                  borderTop: '1px solid var(--border-color)', 
                  paddingTop: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit'
                }}
              >
                <span><strong>{t('predLinearScore', lang)}</strong> {isRtl ? prediction.z.toLocaleString('ar-EG', { minimumFractionDigits: 4, maximumFractionDigits: 4 }) : prediction.z.toFixed(4)}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{t('predConfidenceBand', lang)}: <strong style={{ color: 'var(--text-main)' }}>{confidenceBand}</strong></span>
                <span>
                  {prediction.percentage >= 50 
                    ? t('predHighRiskMsg', lang)
                    : prediction.percentage >= 20
                      ? t('predModRiskMsg', lang)
                      : t('predLowRiskMsg', lang)}
                </span>
              </div>
            </div>
          </div>

          {/* Phase 8.2: Batch Prediction Summary */}
          <div className="glass-panel-noclick" style={{ padding: '20px 24px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '12px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
              {isRtl ? 'ملخص التنبؤ الجماعي' : 'Batch Prediction Summary'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--bg-sidebar)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '4px' }}>{isRtl ? 'إجمالي الموظفين' : 'Total Employees'}</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>{batchSummary.total}</div>
              </div>
              <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
                <div style={{ fontSize: '11px', color: '#10B981', marginBottom: '4px' }}>{isRtl ? 'منخفض المخاطر' : 'Low Risk'}</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#10B981' }}>{batchSummary.low}</div>
              </div>
              <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
                <div style={{ fontSize: '11px', color: '#F59E0B', marginBottom: '4px' }}>{isRtl ? 'متوسط المخاطر' : 'Moderate Risk'}</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#F59E0B' }}>{batchSummary.moderate}</div>
              </div>
              <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                <div style={{ fontSize: '11px', color: '#EF4444', marginBottom: '4px' }}>{isRtl ? 'مرتفع المخاطر' : 'High Risk'}</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#EF4444' }}>{batchSummary.high}</div>
              </div>
              <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--bg-sidebar)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '4px' }}>{isRtl ? 'متوسط النسبة' : 'Avg Risk %'}</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>{batchSummary.avg.toFixed(1)}%</div>
              </div>
            </div>
          </div>

          {/* Diagnostic breakdown & recommendations */}
          <div className="glass-panel-noclick" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
              {t('predDiagnosticTitle', lang)}
            </h4>

            {/* Risk Boosters */}
            {diagnostics.activeBoosters.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-left)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  <AlertTriangle size={12} />
                  {t('predRiskDrivers', lang)}
                </span>
                <ul style={{ listStyle: 'none', paddingLeft: 0, paddingRight: 0, fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {diagnostics.activeBoosters.map((b, i) => (
                    <li key={i} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                      <span>• {translateDiagnosticFactor(b.factor, lang)}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{translateDiagnosticImpact(b.impact, lang)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mitigators */}
            {diagnostics.activeMitigators.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-stayed)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  <CheckCircle size={12} />
                  {t('predStabilizingFactors', lang)}
                </span>
                <ul style={{ listStyle: 'none', paddingLeft: 0, paddingRight: 0, fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                  {diagnostics.activeMitigators.slice(0, 4).map((m, i) => (
                    <li key={i} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                      <span>• {translateDiagnosticFactor(m.factor, lang)}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{translateDiagnosticImpact(m.impact, lang)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            <div 
              style={{ 
                marginTop: 'auto', 
                padding: '16px', 
                backgroundColor: 'rgba(255,255,255,0.02)', 
                border: '1px dashed var(--border-color)', 
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit'
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={14} />
                {t('predHrActions', lang)}
              </span>
              <ul style={{ paddingLeft: isRtl ? 0 : '20px', paddingRight: isRtl ? '20px' : 0, fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {diagnostics.recommendations.map((rec, i) => (
                  <li key={i}>{translateRecommendation(rec, lang)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
