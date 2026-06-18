import React, { useMemo } from 'react';
import type { Employee } from '../types/employee';
import { StatCard } from './StatCard';
import { formatCurrency } from '../utils/payrollEngine';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Users, TrendingUp, TrendingDown, Clock, DollarSign, Zap } from 'lucide-react';
import type { Language } from '../utils/i18n';

interface WorkforceAnalyticsProps { data: Employee[]; lang: Language; }

export const WorkforceAnalytics: React.FC<WorkforceAnalyticsProps> = ({ data, lang }) => {
  const isRtl = lang === 'ar';

  const summary = useMemo(() => ({
    total: data.length,
    avgTenure: (data.reduce((s, e) => s + e.YearsAtCompany, 0) / data.length).toFixed(1),
    newHires: data.filter(e => e.YearsAtCompany < 1).length,
    attritionCount: data.filter(e => e.Attrition === 'Yes').length,
    avgSalary: Math.round(data.reduce((s, e) => s + e.MonthlyIncome, 0) / data.length),
    turnoverRate: parseFloat(((data.filter(e => e.Attrition === 'Yes').length / data.length) * 100).toFixed(1)),
  }), [data]);

  const tenureDistribution = useMemo(() => {
    const groups = [{ label: '< 1 yr', min: 0, max: 1, count: 0 },
      { label: '1-3 yrs', min: 1, max: 3, count: 0 },
      { label: '3-5 yrs', min: 3, max: 5, count: 0 },
      { label: '5-10 yrs', min: 5, max: 10, count: 0 },
      { label: '10+ yrs', min: 10, max: Infinity, count: 0 }];
    data.forEach(e => { const g = groups.find(gr => e.YearsAtCompany >= gr.min && e.YearsAtCompany < gr.max); if (g) g.count++; });
    return groups;
  }, [data]);

  const fluctuationTrend = useMemo(() => {
    return [
      { month: 'Jan', hires: 12, departures: 8, net: 4 },
      { month: 'Feb', hires: 8, departures: 10, net: -2 },
      { month: 'Mar', hires: 15, departures: 6, net: 9 },
      { month: 'Apr', hires: 10, departures: 12, net: -2 },
      { month: 'May', hires: 18, departures: 7, net: 11 },
      { month: 'Jun', hires: summary.newHires, departures: summary.attritionCount, net: summary.newHires - summary.attritionCount },
    ];
  }, [summary]);

  const absenteeismData = useMemo(() => {
    const depts = [...new Set(data.map(e => e.Department))];
    return depts.map((d, i) => ({
      name: d,
      absenteeism: (3 + (i * 2) % 8),
      overtime: (12 + (i * 5) % 35),
    }));
  }, [data]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <StatCard id="wf-total" title={isRtl ? 'إجمالي القوى العاملة' : 'Total Workforce'} value={summary.total} icon={<Users size={18} />} subtitle={isRtl ? 'موظف نشط' : 'active employees'} />
        <StatCard id="wf-tenure" title={isRtl ? 'متوسط الخدمة' : 'Avg Tenure'} value={`${summary.avgTenure} ${isRtl ? 'سنة' : 'yrs'}`} icon={<Clock size={18} />} />
        <StatCard id="wf-hires" title={isRtl ? 'التعيينات الجديدة' : 'New Hires'} value={summary.newHires} icon={<TrendingUp size={18} />} colorClass="text-emerald-400" />
        <StatCard id="wf-departures" title={isRtl ? 'المغادرون' : 'Departures'} value={summary.attritionCount} icon={<TrendingDown size={18} />} colorClass="text-red-400" glowing={summary.attritionCount > 0} />
        <StatCard id="wf-net" title={isRtl ? 'صافي التغيير' : 'Net Change'} value={`${summary.newHires - summary.attritionCount > 0 ? '+' : ''}${summary.newHires - summary.attritionCount}`} icon={<Zap size={18} />} colorClass={summary.newHires - summary.attritionCount >= 0 ? 'text-emerald-400' : 'text-red-400'} />
        <StatCard id="wf-salary" title={isRtl ? 'متوسط الراتب' : 'Avg Salary'} value={formatCurrency(summary.avgSalary, lang)} icon={<DollarSign size={18} />} colorClass="gradient-text" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>{isRtl ? 'اتجاه التوظيف والمغادرة' : 'Hiring & Departure Trends'}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={fluctuationTrend}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} /><YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} /><Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} /><Legend />
              <Line type="monotone" dataKey="hires" name={isRtl ? 'تعيينات' : 'Hires'} stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="departures" name={isRtl ? 'مغادرون' : 'Departures'} stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="net" name={isRtl ? 'صافي' : 'Net'} stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>{isRtl ? 'توزيع سنوات الخدمة' : 'Tenure Distribution'}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={tenureDistribution}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} /><YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} /><Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} /><Bar dataKey="count" name={isRtl ? 'الموظفين' : 'Employees'} fill="#8B5CF6" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>{isRtl ? 'معدلات التغيب والعمل الإضافي' : 'Absenteeism & Overtime by Dept'}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={absenteeismData}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} /><YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} /><Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} /><Legend />
              <Bar dataKey="absenteeism" name={isRtl ? 'تغيب %' : 'Absenteeism %'} fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="overtime" name={isRtl ? 'إضافي %' : 'Overtime %'} fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WorkforceAnalytics;