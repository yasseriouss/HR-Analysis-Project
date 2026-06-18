import React, { useMemo } from 'react';
import type { Employee } from '../types/employee';
import { StatCard } from './StatCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import type { Language } from '../utils/i18n';

interface MSSPortalProps { data: Employee[]; lang: Language; }

export const MSSPortal: React.FC<MSSPortalProps> = ({ data, lang }) => {
  const isRtl = lang === 'ar';

  const dept = useMemo(() => data.length > 0 ? data[0].Department : 'Sales', [data]);
  const team = useMemo(() => data.filter(e => e.Department === dept), [data, dept]);

  const teamStats = useMemo(() => {
    const total = team.length;
    const avgPerformance = total > 0 ? (team.reduce((s, e) => s + e.PerformanceRating, 0) / total).toFixed(1) : '0';
    const avgSatisfaction = total > 0 ? (team.reduce((s, e) => s + e.JobSatisfaction, 0) / total).toFixed(1) : '0';
    const attritionCount = team.filter(e => e.Attrition === 'Yes').length;
    const overtimeCount = team.filter(e => e.OverTime === 'Yes').length;
    const avgTenure = total > 0 ? (team.reduce((s, e) => s + e.YearsAtCompany, 0) / total).toFixed(1) : '0';
    return { total, avgPerformance, avgSatisfaction, attritionCount, overtimeCount, avgTenure };
  }, [team]);

  const pendingApprovals = [
    { id: 'app1', type: 'leave', employee: team[0] ? `Employee #${team[0].EmployeeNumber}` : 'Ahmed', detail: isRtl ? 'إجازة سنوية 5 أيام' : 'Annual leave 5 days', amount: 0 },
    { id: 'app2', type: 'expense', employee: team[1] ? `Employee #${team[1].EmployeeNumber}` : 'Sarah', detail: isRtl ? 'مصاريف سفر 2,500 ج.م' : 'Travel expense EGP 2,500', amount: 2500 },
    { id: 'app3', type: 'overtime', employee: team[2] ? `Employee #${team[2].EmployeeNumber}` : 'Mohamed', detail: isRtl ? '4 ساعات إضافية' : '4 overtime hours', amount: 0 },
    { id: 'app4', type: 'leave', employee: team[3] ? `Employee #${team[3].EmployeeNumber}` : 'Layla', detail: isRtl ? 'إجازة مرضية يومين' : 'Sick leave 2 days', amount: 0 },
  ];

  const approvalTypeColors: Record<string, string> = { leave: '#10B981', expense: '#F59E0B', overtime: '#8B5CF6' };

  const perfPie = useMemo(() => {
    const dist: Record<number, number> = {};
    team.forEach(e => { dist[e.PerformanceRating] = (dist[e.PerformanceRating] || 0) + 1; });
    return Object.entries(dist).map(([r, c]) => ({ name: `${isRtl ? 'تقييم' : 'Rating'} ${r}`, value: c }));
  }, [team, isRtl]);

  const COLORS = ['#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ padding: '20px 24px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(245,158,11,0.08))', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          {isRtl ? `فريق ${dept}` : `${dept} Team`}
        </h2>
        <p style={{ color: 'var(--text-muted)', margin: '6px 0 0', fontSize: '13px' }}>
          {isRtl ? 'بوابة المدير - إدارة الفريق والموافقة على الطلبات' : 'Manager Portal - Team management & request approvals'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        <StatCard id="mss-team-size" title={isRtl ? 'حجم الفريق' : 'Team Size'} value={teamStats.total} icon={<Users size={18} />} subtitle={`${dept}`} />
        <StatCard id="mss-perf" title={isRtl ? 'متوسط الأداء' : 'Avg Performance'} value={`${teamStats.avgPerformance}/4`} icon={<TrendingUp size={18} />} colorClass="gradient-text" />
        <StatCard id="mss-sat" title={isRtl ? 'الرضا الوظيفي' : 'Job Satisfaction'} value={`${teamStats.avgSatisfaction}/4`} icon={<Users size={18} />} />
        <StatCard id="mss-attr" title={isRtl ? 'مخاطر التسرب' : 'Attrition Risk'} value={teamStats.attritionCount} icon={<AlertTriangle size={18} />} colorClass="text-red-400" glowing={teamStats.attritionCount > 0} />
        <StatCard id="mss-ot" title={isRtl ? 'العمل الإضافي' : 'Overtime Rate'} value={`${((teamStats.overtimeCount / teamStats.total) * 100).toFixed(0)}%`} icon={<Clock size={18} />} />
        <StatCard id="mss-tenure" title={isRtl ? 'متوسط الخدمة' : 'Avg Tenure'} value={`${teamStats.avgTenure} ${isRtl ? 'سنة' : 'yrs'}`} icon={<Clock size={18} />} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Clock size={18} style={{ color: '#F59E0B' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              {isRtl ? 'طلبات بانتظار الموافقة' : 'Pending Approvals'}
            </h3>
            <span style={{ marginLeft: 'auto', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}>
              {pendingApprovals.length} {isRtl ? 'طلب' : 'requests'}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pendingApprovals.map((req) => (
              <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 600, background: approvalTypeColors[req.type] + '18', color: approvalTypeColors[req.type] }}>{req.type.toUpperCase()}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-main)' }}>{req.employee}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{req.detail}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button style={{ padding: '4px 10px', borderRadius: '6px', border: 'none', background: 'rgba(16,185,129,0.12)', color: '#10B981', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>{isRtl ? 'اعتماد' : 'Approve'}</button>
                  <button style={{ padding: '4px 10px', borderRadius: '6px', border: 'none', background: 'rgba(239,68,68,0.12)', color: '#EF4444', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>{isRtl ? 'رفض' : 'Reject'}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>{isRtl ? 'توزيع أداء الفريق' : 'Team Performance Distribution'}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={perfPie} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label>
                {perfPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel-noclick" style={{ padding: '16px', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>{isRtl ? 'أعضاء الفريق' : 'Team Members'}</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead><tr style={{ borderBottom: '2px solid var(--border-color)' }}>
            {[isRtl ? 'الموظف' : 'Employee', isRtl ? 'الدور' : 'Role', isRtl ? 'الأداء' : 'Perf', isRtl ? 'الرضا' : 'Sat', isRtl ? 'الخدمة' : 'Tenure', isRtl ? 'التدريب' : 'Training', isRtl ? 'زيادة' : 'Hike'].map((h, i) => (
              <th key={i} style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
            ))}</tr></thead>
          <tbody>
            {team.slice(0, 20).map((emp) => (
              <tr key={emp.EmpID} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-main)' }}>#{emp.EmployeeNumber}</td>
                <td style={{ padding: '8px 10px', color: 'var(--text-muted)' }}>{emp.JobRole}</td>
                <td style={{ padding: '8px 10px', color: emp.PerformanceRating >= 3 ? '#10B981' : '#F59E0B' }}>{emp.PerformanceRating}/4</td>
                <td style={{ padding: '8px 10px', color: emp.JobSatisfaction >= 3 ? '#10B981' : '#F59E0B' }}>{emp.JobSatisfaction}/4</td>
                <td style={{ padding: '8px 10px', color: 'var(--text-muted)' }}>{emp.YearsAtCompany}y</td>
                <td style={{ padding: '8px 10px', color: 'var(--text-muted)' }}>{emp.TrainingTimesLastYear}</td>
                <td style={{ padding: '8px 10px', color: '#8B5CF6' }}>+{emp.PercentSalaryHike}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MSSPortal;