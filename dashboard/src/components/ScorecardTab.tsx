import React, { useMemo } from 'react';
import type { Employee } from '../types/employee';
import { StatCard } from './StatCard';
import { formatCurrency } from '../utils/payrollEngine';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Target, Users, DollarSign, Clock, Award, AlertTriangle } from 'lucide-react';
import type { Language } from '../utils/i18n';

interface ScorecardTabProps { data: Employee[]; lang: Language; }

export const ScorecardTab: React.FC<ScorecardTabProps> = ({ data, lang }) => {
  const isRtl = lang === 'ar';

  const kpis = useMemo(() => {
    const total = data.length;
    const attrition = data.filter(e => e.Attrition === 'Yes').length;
    const avgSatisfaction = (data.reduce((s, e) => s + e.JobSatisfaction, 0) / total).toFixed(1);
    const avgPerformance = (data.reduce((s, e) => s + e.PerformanceRating, 0) / total).toFixed(1);
    const avgIncome = Math.round(data.reduce((s, e) => s + e.MonthlyIncome, 0) / total);
    const avgTenure = (data.reduce((s, e) => s + e.YearsAtCompany, 0) / total).toFixed(1);
    const avgHike = (data.reduce((s, e) => s + e.PercentSalaryHike, 0) / total).toFixed(1);
    const overtimeRate = ((data.filter(e => e.OverTime === 'Yes').length / total) * 100).toFixed(0);
    const avgTraining = (data.reduce((s, e) => s + e.TrainingTimesLastYear, 0) / total).toFixed(1);
    return { total, attrition, avgSatisfaction, avgPerformance, avgIncome, avgTenure, avgHike, overtimeRate, avgTraining };
  }, [data]);

  const radarData = [
    { metric: isRtl ? 'الرضا' : 'Satisfaction', value: parseFloat(kpis.avgSatisfaction), full: 4 },
    { metric: isRtl ? 'الأداء' : 'Performance', value: parseFloat(kpis.avgPerformance), full: 4 },
    { metric: isRtl ? 'الاحتفاظ' : 'Retention', value: 4 - (kpis.attrition / kpis.total) * 4, full: 4 },
    { metric: isRtl ? 'النمو' : 'Growth', value: parseFloat(kpis.avgHike) / 5, full: 4 },
    { metric: isRtl ? 'التدريب' : 'Training', value: parseFloat(kpis.avgTraining), full: 6 },
    { metric: isRtl ? 'الاستقرار' : 'Stability', value: parseFloat(kpis.avgTenure) / 5, full: 4 },
  ];

  const deptScoreboard = useMemo(() => {
    const m: Record<string, { total: number; attrition: number; perf: number; sat: number; income: number }> = {};
    data.forEach(e => {
      if (!m[e.Department]) m[e.Department] = { total: 0, attrition: 0, perf: 0, sat: 0, income: 0 };
      m[e.Department].total++;
      if (e.Attrition === 'Yes') m[e.Department].attrition++;
      m[e.Department].perf += e.PerformanceRating;
      m[e.Department].sat += e.JobSatisfaction;
      m[e.Department].income += e.MonthlyIncome;
    });
    return Object.entries(m).map(([dept, v]) => ({
      name: dept,
      attrition: parseFloat(((v.attrition / v.total) * 100).toFixed(1)),
      performance: parseFloat((v.perf / v.total).toFixed(1)),
      satisfaction: parseFloat((v.sat / v.total).toFixed(1)),
      avgIncome: Math.round(v.income / v.total),
    }));
  }, [data]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Executive KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <StatCard id="sc-total" title={isRtl ? 'إجمالي الموظفين' : 'Total Headcount'} value={kpis.total} icon={<Users size={18} />} subtitle={isRtl ? 'العدد الإجمالي' : 'Active workforce'} />
        <StatCard id="sc-attrition" title={isRtl ? 'معدل التسرب' : 'Attrition Rate'} value={`${((kpis.attrition/kpis.total)*100).toFixed(1)}%`} icon={<AlertTriangle size={18} />} colorClass={kpis.attrition/kpis.total > 0.15 ? 'text-red-400' : 'text-emerald-400'} glowing={kpis.attrition/kpis.total > 0.15} />
        <StatCard id="sc-perf" title={isRtl ? 'متوسط الأداء' : 'Avg Performance'} value={`${kpis.avgPerformance}/4`} icon={<Award size={18} />} colorClass="gradient-text" />
        <StatCard id="sc-sat" title={isRtl ? 'الرضا الوظيفي' : 'Job Satisfaction'} value={`${kpis.avgSatisfaction}/4`} icon={<Target size={18} />} />
        <StatCard id="sc-income" title={isRtl ? 'متوسط الدخل' : 'Avg Income'} value={formatCurrency(kpis.avgIncome, lang)} icon={<DollarSign size={18} />} colorClass="text-emerald-400" />
        <StatCard id="sc-overtime" title={isRtl ? 'العمل الإضافي' : 'Overtime Rate'} value={`${kpis.overtimeRate}%`} icon={<Clock size={18} />} />
      </div>

      {/* Radar Chart + Department Scoreboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>{isRtl ? 'بطاقة الأداء المتوازن' : 'HR Balanced Scorecard'}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}><PolarGrid stroke="var(--border-color)" /><PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} /><PolarRadiusAxis domain={[0, 4]} tick={{ fill: 'var(--text-dim)', fontSize: 10 }} /><Radar dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.25} /></RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>{isRtl ? 'بطاقة الأداء حسب القسم' : 'Department Scorecard'}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deptScoreboard}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} /><YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} /><Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
              <Bar dataKey="attrition" name={isRtl ? 'تسرب %' : 'Attrition %'} fill="#EF4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="performance" name={isRtl ? 'أداء' : 'Performance'} fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="satisfaction" name={isRtl ? 'رضا' : 'Satisfaction'} fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scorecard Table */}
      <div className="glass-panel-noclick" style={{ padding: '16px', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>{isRtl ? 'تفاصيل بطاقة الأداء' : 'Scorecard Details'}</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead><tr style={{ borderBottom: '2px solid var(--border-color)' }}>
            {[isRtl ? 'القسم' : 'Department', isRtl ? 'تسرب %' : 'Attrition', isRtl ? 'أداء' : 'Perf', isRtl ? 'رضا' : 'Sat', isRtl ? 'متوسط الدخل' : 'Avg Income'].map((h, i) => (
              <th key={i} style={{ padding: '10px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
            ))}</tr></thead>
          <tbody>
            {deptScoreboard.map(d => (
              <tr key={d.name} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '10px', fontWeight: 600, color: 'var(--text-main)' }}>{d.name}</td>
                <td style={{ padding: '10px' }}><span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: d.attrition > 15 ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)', color: d.attrition > 15 ? '#EF4444' : '#10B981' }}>{d.attrition}%</span></td>
                <td style={{ padding: '10px', color: 'var(--text-main)' }}>{d.performance}</td>
                <td style={{ padding: '10px', color: 'var(--text-main)' }}>{d.satisfaction}</td>
                <td style={{ padding: '10px', color: 'var(--accent-cyan)', fontWeight: 600 }}>{formatCurrency(d.avgIncome, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScorecardTab;