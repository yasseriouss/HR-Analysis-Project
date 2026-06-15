import React, { useMemo } from 'react';
import type { Employee } from '../types/employee';
import { StatCard } from './StatCard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Star, GraduationCap, Trophy, Dumbbell } from 'lucide-react';
import { t, translateValue } from '../utils/i18n';
import type { Language } from '../utils/i18n';

interface PerformanceTabProps {
  data: Employee[];
  lang: Language;
}

export const PerformanceTab: React.FC<PerformanceTabProps> = ({ data, lang }) => {
  const isRtl = lang === 'ar';

  // 1. Calculate KPIs
  const kpis = useMemo(() => {
    const total = data.length;
    if (total === 0) {
      return { avgPerformance: 0, attritionRate: '0.0%', avgTraining: 0, avgTenure: 0 };
    }
    const sumPerformance = data.reduce((acc, curr) => acc + curr.PerformanceRating, 0);
    const avgPerformance = (sumPerformance / total).toFixed(2);
    
    const left = data.filter(e => e.Attrition === 'Yes').length;
    const attritionRate = ((left / total) * 100).toFixed(1) + '%';
    
    const sumTraining = data.reduce((acc, curr) => acc + curr.TrainingTimesLastYear, 0);
    const avgTraining = (sumTraining / total).toFixed(1);

    const sumTenure = data.reduce((acc, curr) => acc + curr.YearsAtCompany, 0);
    const avgTenure = (sumTenure / total).toFixed(1);

    return { avgPerformance, attritionRate, avgTraining, avgTenure };
  }, [data]);

  // 2. Attrition Rate by Education Level
  const eduLevelData = useMemo(() => {
    const stats: { [key: number]: { total: number; left: number } } = {
      1: { total: 0, left: 0 },
      2: { total: 0, left: 0 },
      3: { total: 0, left: 0 },
      4: { total: 0, left: 0 },
      5: { total: 0, left: 0 }
    };

    data.forEach(e => {
      if (stats[e.Education]) {
        stats[e.Education].total++;
        if (e.Attrition === 'Yes') stats[e.Education].left++;
      }
    });

    const labels = {
      1: 'Below College',
      2: 'College',
      3: 'Bachelor',
      4: 'Master',
      5: 'Doctor'
    };

    return [1, 2, 3, 4, 5].map(lvl => ({
      name: translateValue(labels[lvl as 1 | 2 | 3 | 4 | 5], lang),
      'Attrition Rate (%)': stats[lvl].total > 0 ? parseFloat(((stats[lvl].left / stats[lvl].total) * 100).toFixed(1)) : 0
    }));
  }, [data, lang]);

  // 3. Performance Rating Distribution
  const performanceDistData = useMemo(() => {
    const counts = { 3: 0, 4: 0 };
    data.forEach(e => {
      const r = e.PerformanceRating as 3 | 4;
      if (counts[r] !== undefined) counts[r]++;
    });

    return [
      { name: translateValue('Excellent (Rating 3)', lang), value: counts[3] },
      { name: translateValue('Outstanding (Rating 4)', lang), value: counts[4] }
    ];
  }, [data, lang]);

  // 4. Training Times Last Year vs Attrition Rate
  const trainingData = useMemo(() => {
    const stats: { [key: number]: { total: number; left: number } } = {};
    data.forEach(e => {
      const t = e.TrainingTimesLastYear;
      if (!stats[t]) stats[t] = { total: 0, left: 0 };
      stats[t].total++;
      if (e.Attrition === 'Yes') stats[t].left++;
    });

    return Object.keys(stats).map(t => ({
      name: lang === 'ar' ? `تدريبات: ${t}` : `${t} Sessions`,
      'Attrition Rate (%)': stats[parseInt(t)].total > 0 ? parseFloat(((stats[parseInt(t)].left / stats[parseInt(t)].total) * 100).toFixed(1)) : 0,
      Total: stats[parseInt(t)].total
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [data, lang]);

  // 5. Job Involvement Attrition Rate
  const involvementData = useMemo(() => {
    const stats: { [key: number]: { total: number; left: number } } = {
      1: { total: 0, left: 0 },
      2: { total: 0, left: 0 },
      3: { total: 0, left: 0 },
      4: { total: 0, left: 0 }
    };

    data.forEach(e => {
      if (stats[e.JobInvolvement]) {
        stats[e.JobInvolvement].total++;
        if (e.Attrition === 'Yes') stats[e.JobInvolvement].left++;
      }
    });

    const labelKeys = {
      1: 'satLow' as const,
      2: 'satMed' as const,
      3: 'satHigh' as const,
      4: 'satVeryHigh' as const
    };

    return [1, 2, 3, 4].map(score => ({
      name: t(labelKeys[score as 1 | 2 | 3 | 4], lang),
      'Attrition Rate (%)': stats[score].total > 0 ? parseFloat(((stats[score].left / stats[score].total) * 100).toFixed(1)) : 0
    }));
  }, [data, lang]);

  const PIE_COLORS = ['hsl(185, 90%, 50%)', 'hsl(263, 90%, 65%)'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPIs Grid */}
      <div className="metrics-row">
        <StatCard 
          id="kpi-avg-performance"
          title={t('kpiAvgPerformance', lang)} 
          value={isRtl ? `${parseFloat(kpis.avgPerformance.toString()).toLocaleString('ar-EG')} / ٤` : `${kpis.avgPerformance} / 4`} 
          subtitle={t('kpiAvgPerformanceSub', lang)}
          icon={<Star size={20} />} 
          colorClass="gradient-text"
          glowing={true}
        />
        <StatCard 
          id="kpi-attrition-rate-performance"
          title={t('kpiAttritionRate', lang)} 
          value={isRtl ? kpis.attritionRate.replace('%', '٪') : kpis.attritionRate} 
          subtitle={t('kpiAttritionRateSub', lang)}
          icon={<Trophy size={20} />} 
          colorClass="color-left-text"
          style={{ '--color-left-text': 'var(--color-left)' } as React.CSSProperties}
        />
        <StatCard 
          id="kpi-avg-training"
          title={t('kpiAvgTraining', lang)} 
          value={isRtl ? `${parseFloat(kpis.avgTraining.toString()).toLocaleString('ar-EG')} / سنة` : `${kpis.avgTraining} / yr`} 
          subtitle={t('kpiAvgTrainingSub', lang)}
          icon={<Dumbbell size={20} />} 
        />
        <StatCard 
          id="kpi-avg-tenure-performance"
          title={t('kpiAvgTenure', lang)} 
          value={isRtl ? `${parseFloat(kpis.avgTenure.toString()).toLocaleString('ar-EG')} سنة` : `${kpis.avgTenure} Yrs`} 
          subtitle={t('kpiAvgTenureSub', lang)}
          icon={<GraduationCap size={20} />} 
        />
      </div>

      {/* Row 1: Education Level Attrition & Performance Rating Distribution */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {/* Attrition by Education Level */}
        <div id="chart-education-attrition" className="glass-panel-noclick" style={{ padding: '24px', height: '380px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('chartEduLevelTitle', lang)}
          </h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={eduLevelData}
                margin={{ top: 10, right: isRtl ? -20 : 10, left: isRtl ? 10 : -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} tick={{ fontFamily: isRtl ? 'Tajawal' : 'inherit' }} />
                <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} orientation={isRtl ? 'right' : 'left'} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`, t('tableHeaderRate', lang)]} />
                <Bar dataKey="Attrition Rate (%)" fill="var(--accent-cyan)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Distribution */}
        <div id="chart-performance-distribution" className="glass-panel-noclick" style={{ padding: '24px', height: '380px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('chartPerfDistTitle', lang)}
          </h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={performanceDistData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {performanceDistData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value ? (isRtl ? value.toLocaleString('ar-EG') : value) : '', t('headcount', lang)]} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => translateValue(value, lang)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Training Times & Job Involvement */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {/* Training Times Attrition */}
        <div id="chart-training-attrition" className="glass-panel-noclick" style={{ padding: '24px', height: '380px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('chartTrainingTitle', lang)}
          </h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trainingData}
                margin={{ top: 10, right: isRtl ? -20 : 10, left: isRtl ? 10 : -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} tick={{ fontFamily: isRtl ? 'Tajawal' : 'inherit' }} />
                <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} orientation={isRtl ? 'right' : 'left'} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value, _name, props) => {
                  const total = props.payload.Total;
                  const employeesLabel = isRtl ? 'موظف' : 'Employees';
                  return [`${value}% (${total.toLocaleString(isRtl ? 'ar-EG' : 'en-US')} ${employeesLabel})`, t('tableHeaderRate', lang)];
                }} />
                <Bar dataKey="Attrition Rate (%)" fill="var(--accent-purple)" radius={[4, 4, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Job Involvement */}
        <div id="chart-job-involvement" className="glass-panel-noclick" style={{ padding: '24px', height: '380px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('chartInvolvementTitle', lang)}
          </h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={involvementData}
                margin={{ top: 10, right: isRtl ? -20 : 10, left: isRtl ? 10 : -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} tick={{ fontFamily: isRtl ? 'Tajawal' : 'inherit' }} />
                <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} orientation={isRtl ? 'right' : 'left'} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`, t('tableHeaderRate', lang)]} />
                <Bar dataKey="Attrition Rate (%)" fill="var(--color-warning)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
