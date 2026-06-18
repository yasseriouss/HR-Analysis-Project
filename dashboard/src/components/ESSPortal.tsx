import React, { useMemo } from 'react';
import type { Employee } from '../types/employee';
import { StatCard } from './StatCard';
import { formatCurrency } from '../utils/payrollEngine';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { 
  User, CalendarCheck, ReceiptText, DollarSign, 
  Briefcase, TrendingUp
} from 'lucide-react';
import type { Language } from '../utils/i18n';

interface ESSPortalProps { data: Employee[]; lang: Language; }

export const ESSPortal: React.FC<ESSPortalProps> = ({ data, lang }) => {
  const isRtl = lang === 'ar';

  // Simulate a logged-in employee (picking a random one for demo)
  const myProfile = useMemo(() => data[0], [data]);

  // Personal KPIs
  const personalKpis = useMemo(() => {
    if (!myProfile) return { income: 0, tenure: 0, satisfaction: 0, hike: 0 };
    return {
      income: myProfile.MonthlyIncome,
      tenure: myProfile.YearsAtCompany,
      satisfaction: myProfile.JobSatisfaction,
      hike: myProfile.PercentSalaryHike,
    };
  }, [myProfile]);

  // Leave balance (simulated)
  const leaveBalances = [
    { name: isRtl ? 'سنوية' : 'Annual', used: 8, total: 21, color: '#10B981' },
    { name: isRtl ? 'مرضية' : 'Sick', used: 2, total: 14, color: '#F59E0B' },
    { name: isRtl ? 'عارضة' : 'Casual', used: 3, total: 5, color: '#8B5CF6' },
  ];

  // Recent payslips
  const payslips = useMemo(() => {
    const base = myProfile ? Math.round(myProfile.MonthlyIncome * 0.65) : 2500;
    return [
      { month: 'Mar 2026', gross: base + 450, deductions: Math.round(base * 0.28), net: base + 450 - Math.round(base * 0.28) },
      { month: 'Apr 2026', gross: base + 500, deductions: Math.round(base * 0.28), net: base + 500 - Math.round(base * 0.28) },
      { month: 'May 2026', gross: base + 500, deductions: Math.round(base * 0.28), net: base + 500 - Math.round(base * 0.28) },
      { month: 'Jun 2026', gross: base + 550, deductions: Math.round(base * 0.28), net: base + 550 - Math.round(base * 0.28) },
    ];
  }, [myProfile]);

  if (!myProfile) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-dim)' }}>{isRtl ? 'لا توجد بيانات متاحة' : 'No data available'}</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Banner */}
      <div style={{
        padding: '24px', borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.1))',
        border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            {isRtl ? `مرحباً، ${myProfile.Gender === 'Male' ? 'السيد' : 'السيدة'} موظف #${myProfile.EmployeeNumber}` : `Welcome, ${myProfile.Gender === 'Male' ? 'Mr.' : 'Ms.'} Employee #${myProfile.EmployeeNumber}`}
          </h2>
          <p style={{ color: 'var(--text-muted)', margin: '8px 0 0' }}>
            {myProfile.Department} • {myProfile.JobRole}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ padding: '6px 14px', borderRadius: '20px', background: 'rgba(16,185,129,0.12)', color: '#10B981', fontSize: '12px', fontWeight: 600 }}>
            {isRtl ? 'نشط' : 'Active'}
          </span>
          <span style={{ padding: '6px 14px', borderRadius: '20px', background: 'rgba(6,182,212,0.12)', color: '#06B6D4', fontSize: '12px', fontWeight: 600 }}>
            ID: {myProfile.EmpID}
          </span>
        </div>
      </div>

      {/* Personal KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <StatCard id="ess-income" title={isRtl ? 'الراتب الشهري' : 'Monthly Salary'} value={formatCurrency(personalKpis.income, lang)} icon={<DollarSign size={18} />} colorClass="text-emerald-400" />
        <StatCard id="ess-tenure" title={isRtl ? 'سنوات الخدمة' : 'Years at Company'} value={`${personalKpis.tenure} ${isRtl ? 'سنة' : 'yrs'}`} icon={<Briefcase size={18} />} />
        <StatCard id="ess-hike" title={isRtl ? 'آخر زيادة' : 'Last Hike'} value={`+${personalKpis.hike}%`} icon={<TrendingUp size={18} />} colorClass="gradient-text" />
        <StatCard id="ess-satisfaction" title={isRtl ? 'الرضا الوظيفي' : 'Job Satisfaction'} value={`${personalKpis.satisfaction}/4`} icon={<User size={18} />} />
      </div>

      {/* Leave Balances + Payslip chart */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        {/* Leave Balances */}
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
            {isRtl ? 'رصيد الإجازات' : 'Leave Balances'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {leaveBalances.map((bal) => (
              <div key={bal.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{bal.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{bal.used}/{bal.total} {isRtl ? 'يوم' : 'days'}</span>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', background: 'var(--border-color)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${(bal.used / bal.total) * 100}%`,
                    background: bal.color, borderRadius: '4px', transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <p style={{ margin: '0', fontSize: '12px', color: '#10B981', fontWeight: 600 }}>
              {isRtl ? '💡 لديك 11 يوم إجازة متبقية' : '💡 11 days total leave remaining'}
            </p>
          </div>
        </div>

        {/* Recent Payslips */}
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
            {isRtl ? 'آخر قسائم الراتب' : 'Recent Payslips'}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={payslips}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px' }}
                formatter={(v) => [formatCurrency(Number(v), lang), '']} />
              <Bar dataKey="gross" name={isRtl ? 'الإجمالي' : 'Gross'} fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="net" name={isRtl ? 'الصافي' : 'Net'} fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-panel-noclick" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
          {isRtl ? 'إجراءات سريعة' : 'Quick Actions'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          {[
            { icon: <CalendarCheck size={16} />, label: isRtl ? 'طلب إجازة' : 'Request Leave', color: '#10B981' },
            { icon: <ReceiptText size={16} />, label: isRtl ? 'مطالبة مصروفات' : 'Submit Expense', color: '#F59E0B' },
            { icon: <DollarSign size={16} />, label: isRtl ? 'قسيمة الراتب' : 'View Payslip', color: '#8B5CF6' },
            { icon: <User size={16} />, label: isRtl ? 'تحديث البيانات' : 'Update Profile', color: '#06B6D4' },
          ].map((action, i) => (
            <button key={i} style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px',
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: '10px', cursor: 'pointer', color: 'var(--text-main)',
              fontSize: '13px', fontWeight: 600, transition: 'all 0.2s ease'
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = action.color; e.currentTarget.style.background = action.color + '10'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'var(--bg-card)'; }}>
              <span style={{ color: action.color }}>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ESSPortal;