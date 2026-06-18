import React, { useMemo } from 'react';
import type { Employee } from '../types/employee';
import { StatCard } from './StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Award, Target, TrendingUp, Star } from 'lucide-react';
import type { Language } from '../utils/i18n';

interface PerformanceReviewProps { data: Employee[]; lang: Language; }

export const PerformanceReview: React.FC<PerformanceReviewProps> = ({ data, lang }) => {
  const isRtl = lang === 'ar';

  const summary = useMemo(() => {
    const total = data.length;
    const avgPerf = (data.reduce((s, e) => s + e.PerformanceRating, 0) / total).toFixed(1);
    const avgHike = (data.reduce((s, e) => s + e.PercentSalaryHike, 0) / total).toFixed(1);
    const topPerformers = data.filter(e => e.PerformanceRating >= 3).length;
    const avgJobSat = (data.reduce((s, e) => s + e.JobSatisfaction, 0) / total).toFixed(1);
    return { total, avgPerf, avgHike, topPerformers, avgJobSat };
  }, [data]);

  const kpiData = useMemo(() => [
    { metric: isRtl ? 'الأداء' : 'Performance', value: parseFloat(summary.avgPerf), target: 4 },
    { metric: isRtl ? 'الرضا' : 'Satisfaction', value: parseFloat(summary.avgJobSat), target: 4 },
    { metric: isRtl ? 'زيادة' : 'Salary Hike', value: parseFloat(summary.avgHike) / 5, target: 4 },
    { metric: isRtl ? 'تدريب' : 'Training', value: (data.reduce((s, e) => s + e.TrainingTimesLastYear, 0) / summary.total), target: 6 },
    { metric: isRtl ? 'اندماج' : 'Involvement', value: (data.reduce((s, e) => s + e.JobInvolvement, 0) / summary.total), target: 4 },
    { metric: isRtl ? 'ترقيات' : 'Promotions', value: data.filter(e => e.YearsSinceLastPromotion <= 2).length / summary.total * 4, target: 4 },
  ], [data, summary, isRtl]);

  const deptPerf = useMemo(() => {
    const m: Record<string, { count: number; perf: number; sat: number; hike: number }> = {};
    data.forEach(e => {
      if (!m[e.Department]) m[e.Department] = { count: 0, perf: 0, sat: 0, hike: 0 };
      m[e.Department].count++; m[e.Department].perf += e.PerformanceRating;
      m[e.Department].sat += e.JobSatisfaction; m[e.Department].hike += e.PercentSalaryHike;
    });
    return Object.entries(m).map(([name, v]) => ({
      name, performance: parseFloat((v.perf / v.count).toFixed(1)),
      satisfaction: parseFloat((v.sat / v.count).toFixed(1)), hike: parseFloat((v.hike / v.count).toFixed(1)),
    }));
  }, [data]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <StatCard id="pr-perf" title={isRtl ? 'متوسط الأداء' : 'Avg Performance'} value={`${summary.avgPerf}/4`} icon={<Award size={18} />} colorClass="gradient-text" />
        <StatCard id="pr-top" title={isRtl ? 'متفوقون' : 'Top Performers'} value={`${summary.topPerformers} (${((summary.topPerformers / summary.total) * 100).toFixed(0)}%)`} icon={<Star size={18} />} colorClass="text-emerald-400" />
        <StatCard id="pr-hike" title={isRtl ? 'متوسط الزيادة' : 'Avg Salary Hike'} value={`${summary.avgHike}%`} icon={<TrendingUp size={18} />} />
        <StatCard id="pr-sat" title={isRtl ? 'الرضا الوظيفي' : 'Job Satisfaction'} value={`${summary.avgJobSat}/4`} icon={<Target size={18} />} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>{isRtl ? 'بطاقة الأداء المتوازن' : 'Performance Scorecard'}</h3>
          <ResponsiveContainer width="100%" height={300}><RadarChart data={kpiData}><PolarGrid stroke="var(--border-color)" /><PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} /><PolarRadiusAxis domain={[0, 4]} tick={{ fill: 'var(--text-dim)', fontSize: 10 }} /><Radar dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.25} /><Radar dataKey="target" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.05} /></RadarChart></ResponsiveContainer>
        </div>
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>{isRtl ? 'الأداء حسب القسم' : 'Performance by Department'}</h3>
          <ResponsiveContainer width="100%" height={300}><BarChart data={deptPerf}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} /><YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} /><Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
            <Bar dataKey="performance" name={isRtl ? 'أداء' : 'Performance'} fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="satisfaction" name={isRtl ? 'رضا' : 'Satisfaction'} fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart></ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
export default PerformanceReview;