import React, { useMemo } from 'react';
import type { Employee } from '../types/employee';
import { UserPlus, Briefcase, TrendingUp, ArrowRightLeft, LogOut, GraduationCap } from 'lucide-react';
import type { Language } from '../utils/i18n';

interface LifecycleTabProps { data: Employee[]; lang: Language; }

type LifecycleStage = 'onboarding' | 'active' | 'promotion' | 'transfer' | 'development' | 'offboarding';

const STAGE_INFO: Record<LifecycleStage, { en: string; ar: string; icon: React.ReactNode; color: string }> = {
  onboarding: { en: 'Onboarding', ar: 'التهيئة', icon: <UserPlus size={14} />, color: '#10B981' },
  active: { en: 'Active', ar: 'نشط', icon: <Briefcase size={14} />, color: '#06B6D4' },
  promotion: { en: 'Promotion', ar: 'ترقية', icon: <TrendingUp size={14} />, color: '#8B5CF6' },
  transfer: { en: 'Transfer', ar: 'نقل', icon: <ArrowRightLeft size={14} />, color: '#F59E0B' },
  development: { en: 'Development', ar: 'تطوير', icon: <GraduationCap size={14} />, color: '#6366F1' },
  offboarding: { en: 'Offboarding', ar: 'إنهاء', icon: <LogOut size={14} />, color: '#EF4444' },
};

function classifyEmployees(employees: Employee[]): Record<LifecycleStage, Employee[]> {
  const stages: Record<LifecycleStage, Employee[]> = {
    onboarding: [], active: [], promotion: [], transfer: [], development: [], offboarding: []
  };
  employees.forEach(emp => {
    if (emp.YearsAtCompany < 1) stages.onboarding.push(emp);
    else if (emp.YearsSinceLastPromotion === 0) stages.promotion.push(emp);
    else if (emp.Attrition === 'Yes') stages.offboarding.push(emp);
    else if (emp.TrainingTimesLastYear >= 5) stages.development.push(emp);
    else if (emp.YearsInCurrentRole < emp.YearsAtCompany) stages.transfer.push(emp);
    else stages.active.push(emp);
  });
  return stages;
}

export const LifecycleTab: React.FC<LifecycleTabProps> = ({ data, lang }) => {
  const isRtl = lang === 'ar';
  const stages = useMemo(() => classifyEmployees(data), [data]);

  const stageOrder: LifecycleStage[] = ['onboarding', 'active', 'promotion', 'transfer', 'development', 'offboarding'];

  const stageData = stageOrder.map(stage => ({
    stage,
    ...STAGE_INFO[stage],
    count: stages[stage].length,
    percentage: ((stages[stage].length / data.length) * 100).toFixed(1),
  }));

  // Checklist items
  const onboardingTasks = [
    { label: isRtl ? 'توقيع العقد' : 'Sign contract', done: true },
    { label: isRtl ? 'تسليم المستندات' : 'Submit documents', done: true },
    { label: isRtl ? 'إعداد الحسابات' : 'Setup IT accounts', done: true },
    { label: isRtl ? 'جولة تعريفية' : 'Office tour', done: false },
    { label: isRtl ? 'لقاء مع المدير' : 'Manager intro meeting', done: false },
  ];

  const offboardingTasks = [
    { label: isRtl ? 'مقابلة الخروج' : 'Exit interview', done: true },
    { label: isRtl ? 'تسليم الأصول' : 'Return assets', done: true },
    { label: isRtl ? 'إلغاء الحسابات' : 'Revoke access', done: false },
    { label: isRtl ? 'حساب المستحقات' : 'Calculate final settlement', done: false },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Lifecycle Progress Bar */}
      <div className="glass-panel-noclick" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '20px' }}>
          {isRtl ? 'دورة حياة الموظف' : 'Employee Lifecycle'}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          {stageData.map((s, i) => (
            <React.Fragment key={s.stage}>
              <div style={{
                flex: 1, minWidth: '140px', padding: '16px', borderRadius: '12px',
                background: `${s.color}10`, border: `1px solid ${s.color}30`, textAlign: 'center'
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px', color: s.color }}>{s.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)', marginBottom: '4px' }}>{isRtl ? s.ar : s.en}</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: s.color }}>{s.count}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>{s.percentage}%</div>
              </div>
              {i < stageData.length - 1 && (
                <div style={{ color: 'var(--text-dim)', fontSize: '18px' }}>→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Onboarding & Offboarding Checklists */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        {/* Onboarding */}
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#10B981', marginBottom: '16px' }}>
            <UserPlus size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            {isRtl ? 'قائمة التهيئة' : 'Onboarding Checklist'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {onboardingTasks.map((task, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <span style={{
                  width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: task.done ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.1)', color: task.done ? '#10B981' : 'var(--text-dim)', fontSize: '12px', fontWeight: 700
                }}>
                  {task.done ? '✓' : '○'}
                </span>
                <span style={{ fontSize: '13px', color: task.done ? 'var(--text-main)' : 'var(--text-muted)' }}>{task.label}</span>
                {!task.done && <span style={{ marginLeft: 'auto', fontSize: '10px', padding: '2px 6px', borderRadius: '8px', background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}>{isRtl ? 'معلق' : 'Pending'}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Offboarding */}
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#EF4444', marginBottom: '16px' }}>
            <LogOut size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            {isRtl ? 'قائمة إنهاء الخدمة' : 'Offboarding Checklist'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {offboardingTasks.map((task, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <span style={{
                  width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: task.done ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.1)', color: task.done ? '#10B981' : 'var(--text-dim)', fontSize: '12px', fontWeight: 700
                }}>
                  {task.done ? '✓' : '○'}
                </span>
                <span style={{ fontSize: '13px', color: task.done ? 'var(--text-main)' : 'var(--text-muted)' }}>{task.label}</span>
                {!task.done && <span style={{ marginLeft: 'auto', fontSize: '10px', padding: '2px 6px', borderRadius: '8px', background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}>{isRtl ? 'معلق' : 'Pending'}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Hires & Departures Table */}
      <div className="glass-panel-noclick" style={{ padding: '16px', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
          {isRtl ? 'الموظفون الجدد والمغادرون' : 'Recent Hires & Departures'}
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead><tr style={{ borderBottom: '2px solid var(--border-color)' }}>
            {[isRtl ? 'الموظف' : 'Employee', isRtl ? 'القسم' : 'Department', isRtl ? 'الدور' : 'Role', isRtl ? 'المرحلة' : 'Stage', isRtl ? 'الحالة' : 'Status'].map((h, i) => (
              <th key={i} style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
            ))}</tr></thead>
          <tbody>
            {[...stages.onboarding, ...stages.offboarding].slice(0, 15).map((emp) => (
              <tr key={emp.EmpID} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-main)' }}>#{emp.EmployeeNumber}</td>
                <td style={{ padding: '8px 10px', color: 'var(--text-muted)' }}>{emp.Department}</td>
                <td style={{ padding: '8px 10px', color: 'var(--text-main)' }}>{emp.JobRole}</td>
                <td style={{ padding: '8px 10px' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600,
                    background: emp.YearsAtCompany < 1 ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                    color: emp.YearsAtCompany < 1 ? '#10B981' : '#EF4444'
                  }}>
                    {emp.YearsAtCompany < 1 ? (isRtl ? 'جديد' : 'New Hire') : (isRtl ? 'مستقيل' : 'Leaving')}
                  </span>
                </td>
                <td style={{ padding: '8px 10px', color: emp.Attrition === 'No' ? '#10B981' : '#EF4444', fontWeight: 600 }}>
                  {emp.Attrition === 'No' ? '✓ ' + (isRtl ? 'نشط' : 'Active') : '✗ ' + (isRtl ? 'غادر' : 'Attrited')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LifecycleTab;