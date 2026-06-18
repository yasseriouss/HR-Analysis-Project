import React, { useMemo, useState } from 'react';
import type { Employee } from '../types/employee';
import { StatCard } from './StatCard';
import { formatCurrency } from '../utils/payrollEngine';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, TrendingUp, TrendingDown, Users } from 'lucide-react';
import type { Language } from '../utils/i18n';

interface ReportsTabProps { data: Employee[]; lang: Language; }

export const ReportsTab: React.FC<ReportsTabProps> = ({ data, lang }) => {
  const isRtl = lang === 'ar';
  const [reportType, setReportType] = useState<'headcount' | 'turnover' | 'payroll' | 'attendance'>('headcount');
  const reports = [
    { id: 'headcount' as const, en: 'Headcount Report', ar: 'تقرير عدد الموظفين' },
    { id: 'turnover' as const, en: 'Turnover Report', ar: 'تقرير الدوران الوظيفي' },
    { id: 'payroll' as const, en: 'Payroll Summary', ar: 'ملخص الرواتب' },
    { id: 'attendance' as const, en: 'Attendance Summary', ar: 'ملخص الحضور' },
  ];

  const summary = useMemo(() => ({
    totalEmployees: data.length,
    avgSalary: Math.round(data.reduce((s, e) => s + e.MonthlyIncome, 0) / data.length),
    attritionRate: parseFloat(((data.filter(e => e.Attrition === 'Yes').length / data.length) * 100).toFixed(1)),
    avgTenure: (data.reduce((s, e) => s + e.YearsAtCompany, 0) / data.length).toFixed(1),
  }), [data]);

  const turnoverData = useMemo(() => {
    const m: Record<string, { total: number; left: number }> = {};
    data.forEach(e => { if (!m[e.Department]) m[e.Department] = { total: 0, left: 0 }; m[e.Department].total++; if (e.Attrition === 'Yes') m[e.Department].left++; });
    return Object.entries(m).map(([name, v]) => ({ name, rate: parseFloat(((v.left / v.total) * 100).toFixed(1)), left: v.left, total: v.total }));
  }, [data]);

  const payrollData = useMemo(() => {
    const m: Record<string, { sum: number; count: number }> = {};
    data.forEach(e => { if (!m[e.Department]) m[e.Department] = { sum: 0, count: 0 }; m[e.Department].sum += e.MonthlyIncome; m[e.Department].count++; });
    return Object.entries(m).map(([name, v]) => ({ name, avg: Math.round(v.sum / v.count), total: v.sum }));
  }, [data]);

  const headcountTrend = useMemo(() => {
    const depts = [...new Set(data.map(e => e.Department))];
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((mon, mi) => {
      const entry: Record<string, string | number> = { month: mon };
      depts.forEach(d => { entry[d] = data.filter(e => e.Department === d).length + (mi % 5) - 2; });
      return entry;
    });
  }, [data]);

  const attendanceData = useMemo(() => {
    const depts = [...new Set(data.map(e => e.Department))];
    return depts.map((d, i) => ({ name: d, present: 88 + (i % 7), late: (i * 3) % 8, absent: (i + 2) % 5 }));
  }, [data]);

  const handleExport = () => { alert(isRtl ? 'سيتم تصدير التقرير كملف CSV' : 'Report will be exported as CSV'); };

  const renderReport = () => {
    switch (reportType) {
      case 'headcount': return (
        <div style={{ gap: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{isRtl ? 'اتجاه عدد الموظفين حسب القسم' : 'Headcount Trend by Department'}</h3>
          <ResponsiveContainer width="100%" height={350}><LineChart data={headcountTrend}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} /><YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} /><Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />{[...new Set(data.map(e => e.Department))].map((dept, i) => <Line key={dept} type="monotone" dataKey={dept} stroke={['#8B5CF6', '#06B6D4', '#10B981'][i % 3]} strokeWidth={2} dot={{ r: 4 }} />)}</LineChart></ResponsiveContainer>
        </div>);
      case 'turnover': return (
        <div style={{ gap: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{isRtl ? 'معدل الدوران حسب القسم' : 'Turnover Rate by Department'}</h3>
          <ResponsiveContainer width="100%" height={350}><BarChart data={turnoverData}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} /><YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} /><Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} /><Bar dataKey="rate" name={isRtl ? 'معدل التسرب %' : 'Attrition %'} fill="#EF4444" radius={[4, 4, 0, 0]} /><Bar dataKey="left" name={isRtl ? 'المغادرون' : 'Left'} fill="#F59E0B" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}><thead><tr style={{ borderBottom: '2px solid var(--border-color)' }}>{[isRtl ? 'القسم' : 'Department', isRtl ? 'الإجمالي' : 'Total', isRtl ? 'المغادرون' : 'Left', isRtl ? 'النسبة' : 'Rate'].map((h, i) => <th key={i} style={{ padding: '10px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>)}</tr></thead><tbody>{turnoverData.map(d => <tr key={d.name} style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '10px', color: 'var(--text-main)' }}>{d.name}</td><td style={{ padding: '10px', color: 'var(--text-muted)' }}>{d.total}</td><td style={{ padding: '10px', color: '#EF4444' }}>{d.left}</td><td style={{ padding: '10px' }}><span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, background: d.rate > 10 ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)', color: d.rate > 10 ? '#EF4444' : '#10B981' }}>{d.rate}%</span></td></tr>)}</tbody></table>
        </div>);
      case 'payroll': return (
        <div style={{ gap: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{isRtl ? 'ملخص الرواتب حسب القسم' : 'Payroll Summary by Department'}</h3>
          <ResponsiveContainer width="100%" height={350}><BarChart data={payrollData}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} /><YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} /><Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} formatter={(v) => [formatCurrency(Number(v), lang), '']} /><Bar dataKey="avg" name={isRtl ? 'متوسط الراتب' : 'Avg Salary'} fill="#8B5CF6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
        </div>);
      case 'attendance': return (
        <div style={{ gap: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{isRtl ? 'ملخص الحضور' : 'Attendance Summary'}</h3>
          <ResponsiveContainer width="100%" height={350}><BarChart data={attendanceData}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} /><YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} /><Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} /><Bar dataKey="present" name={isRtl ? 'حاضر' : 'Present'} fill="#10B981" radius={[4, 4, 0, 0]} stackId="a" /><Bar dataKey="late" name={isRtl ? 'متأخر' : 'Late'} fill="#F59E0B" stackId="a" /><Bar dataKey="absent" name={isRtl ? 'غائب' : 'Absent'} fill="#EF4444" stackId="a" /></BarChart></ResponsiveContainer>
        </div>);
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <StatCard id="rep-headcount" title={isRtl ? 'إجمالي الموظفين' : 'Total Headcount'} value={summary.totalEmployees} icon={<Users size={18} />} />
        <StatCard id="rep-avg-salary" title={isRtl ? 'متوسط الراتب' : 'Average Salary'} value={formatCurrency(summary.avgSalary, lang)} icon={<TrendingUp size={18} />} colorClass="gradient-text" />
        <StatCard id="rep-attrition" title={isRtl ? 'معدل التسرب' : 'Attrition Rate'} value={`${summary.attritionRate}%`} icon={<TrendingDown size={18} />} colorClass={summary.attritionRate > 15 ? 'text-red-400' : 'text-emerald-400'} glowing={summary.attritionRate > 15} />
        <StatCard id="rep-tenure" title={isRtl ? 'متوسط الخدمة' : 'Avg Tenure'} value={`${summary.avgTenure} ${isRtl ? 'سنة' : 'yrs'}`} icon={<Users size={18} />} />
      </div>
      <div className="glass-panel-noclick" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {reports.map(r => <button key={r.id} onClick={() => setReportType(r.id)} style={{ padding: '8px 16px', borderRadius: '8px', border: reportType === r.id ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)', background: reportType === r.id ? 'rgba(6,182,212,0.1)' : 'var(--bg-card)', color: reportType === r.id ? 'var(--accent-cyan)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>{isRtl ? r.ar : r.en}</button>)}
          </div>
          <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}><Download size={14} />{isRtl ? 'تصدير' : 'Export'}</button>
        </div>
        {renderReport()}
      </div>
    </div>
  );
};
export default ReportsTab;