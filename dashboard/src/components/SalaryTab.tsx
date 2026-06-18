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
  LineChart,
  Line
} from 'recharts';
import { DollarSign, TrendingUp, Briefcase } from 'lucide-react';
import { t, translateValue } from '../utils/i18n';
import type { Language } from '../utils/i18n';

interface SalaryTabProps {
  data: Employee[];
  lang: Language;
}

export const SalaryTab: React.FC<SalaryTabProps> = ({ data, lang }) => {
  const isRtl = lang === 'ar';

  // 1. Calculate KPIs
  const kpis = useMemo(() => {
    const total = data.length;
    if (total === 0) {
      return { avgIncome: t('salaryDefaultIncome', lang), avgHike: '0.0%', avgTenure: t('salaryDefaultTenure', lang) };
    }
    const sumIncome = data.reduce((acc, curr) => acc + curr.MonthlyIncome, 0);
    const avgIncome = isRtl 
      ? `${(sumIncome / total / 1000).toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${t('unitThousandEgp', lang)}`
      : '$' + (sumIncome / total / 1000).toFixed(2) + t('unitThousandsK', lang);
    
    const sumHike = data.reduce((acc, curr) => acc + curr.PercentSalaryHike, 0);
    const avgHike = (sumHike / total).toFixed(1) + '%';
    
    const sumTenure = data.reduce((acc, curr) => acc + curr.YearsAtCompany, 0);
    const avgTenure = isRtl 
      ? `${(sumTenure / total).toLocaleString('ar-EG', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ${t('unitYear', lang)}`
      : (sumTenure / total).toFixed(1) + ' ' + t('unitYears', lang);

    return { avgIncome, avgHike, avgTenure };
  }, [data, isRtl]);

  // 2. Average Monthly Income by Job Role
  const roleIncomeData = useMemo(() => {
    const roleStats: { [key: string]: { sum: number; count: number } } = {};
    data.forEach(e => {
      if (!roleStats[e.JobRole]) roleStats[e.JobRole] = { sum: 0, count: 0 };
      roleStats[e.JobRole].sum += e.MonthlyIncome;
      roleStats[e.JobRole].count++;
    });

    return Object.keys(roleStats).map(role => ({
      name: translateValue(role, lang),
      'Avg Income': Math.round(roleStats[role].sum / roleStats[role].count)
    })).sort((a, b) => b['Avg Income'] - a['Avg Income']);
  }, [data, lang]);

  // 3. Performance vs Salary Hike
  const hikePerformanceData = useMemo(() => {
    const perfStats: { [key: number]: { sum: number; count: number } } = {
      3: { sum: 0, count: 0 },
      4: { sum: 0, count: 0 }
    };
    data.forEach(e => {
      if (perfStats[e.PerformanceRating]) {
        perfStats[e.PerformanceRating].sum += e.PercentSalaryHike;
        perfStats[e.PerformanceRating].count++;
      }
    });

    return [
      {
        name: translateValue('Excellent (Rating 3)', lang),
        'Avg Hike (%)': perfStats[3].count > 0 ? parseFloat((perfStats[3].sum / perfStats[3].count).toFixed(1)) : 0
      },
      {
        name: translateValue('Outstanding (Rating 4)', lang),
        'Avg Hike (%)': perfStats[4].count > 0 ? parseFloat((perfStats[4].sum / perfStats[4].count).toFixed(1)) : 0
      }
    ];
  }, [data, lang]);

  // 4. Salary Slab count with Attrition
  const salarySlabData = useMemo(() => {
    const order = ['Upto $5K', '$5K-$10K', '$10K-$15K', '$15K+'];
    const counts: { [key: string]: { Stayed: number; Left: number } } = {};
    order.forEach(s => counts[s] = { Stayed: 0, Left: 0 });

    data.forEach(e => {
      if (counts[e.SalarySlab]) {
        if (e.Attrition === 'Yes') counts[e.SalarySlab].Left++;
        else counts[e.SalarySlab].Stayed++;
      }
    });

    return order.map(slab => ({
      name: translateValue(slab, lang),
      Stayed: counts[slab].Stayed,
      Left: counts[slab].Left
    }));
  }, [data, lang]);

  // 5. Avg Monthly Income by Years at Company
  const incomeTenureData = useMemo(() => {
    const stats: { [key: number]: { sum: number; count: number } } = {};
    data.forEach(e => {
      const yrs = e.YearsAtCompany;
      if (yrs <= 25) { 
        if (!stats[yrs]) stats[yrs] = { sum: 0, count: 0 };
        stats[yrs].sum += e.MonthlyIncome;
        stats[yrs].count++;
      }
    });

    return Object.keys(stats).map(yrs => ({
      years: parseInt(yrs),
      Income: Math.round(stats[parseInt(yrs)].sum / stats[parseInt(yrs)].count)
    })).sort((a, b) => a.years - b.years);
  }, [data]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPIs Grid */}
      <div className="metrics-row">
        <StatCard 
          id="kpi-avg-income"
          title={t('kpiAvgIncome', lang)} 
          value={kpis.avgIncome} 
          subtitle={t('kpiAvgIncomeSub', lang)}
          icon={<DollarSign size={20} />} 
          colorClass="gradient-text"
          glowing={true}
        />
        <StatCard 
          id="kpi-avg-hike"
          title={t('kpiAvgHike', lang)} 
          value={isRtl ? kpis.avgHike.replace('%', '٪') : kpis.avgHike} 
          subtitle={t('kpiAvgHikeSub', lang)}
          icon={<TrendingUp size={20} />} 
          colorClass="color-stayed-text"
          style={{ '--color-stayed-text': 'var(--color-stayed)' } as React.CSSProperties}
        />
        <StatCard 
          id="kpi-avg-tenure"
          title={t('kpiAvgTenure', lang)} 
          value={kpis.avgTenure} 
          subtitle={t('kpiAvgTenureSub', lang)}
          icon={<Briefcase size={20} />} 
        />
      </div>

      {/* Row 1: Monthly Income by Job Role */}
      <div className="glass-panel-noclick" style={{ padding: '24px', height: '400px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
          {t('chartRoleIncomeTitle', lang)}
        </h3>
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={roleIncomeData}
              margin={{ top: 10, right: isRtl ? -20 : 10, left: isRtl ? 10 : -20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="var(--text-dim)" 
                fontSize={11} 
                tickLine={false} 
                angle={isRtl ? 15 : -15}
                textAnchor={isRtl ? 'start' : 'end'}
                interval={0}
                tick={{ fontFamily: isRtl ? 'Tajawal' : 'inherit' }}
              />
              <YAxis 
                stroke="var(--text-dim)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                orientation={isRtl ? 'right' : 'left'}
                tickFormatter={(value) => isRtl ? `${(value/1000).toLocaleString('ar-EG')} ${t('unitThousandEgp', lang)}` : `$${value/1000}${t('unitThousandsK', lang)}`}
              />
              <Tooltip formatter={(value) => [value ? (isRtl ? `${parseFloat(value.toString()).toLocaleString('ar-EG')} $` : `$${value.toLocaleString()}`) : '', t('avgIncomeLegend', lang)]} />
              <Bar dataKey="Avg Income" fill="url(#purpleCyanGrad)" radius={[4, 4, 0, 0]} barSize={40}>
                <defs>
                  <linearGradient id="purpleCyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-purple)" />
                    <stop offset="100%" stopColor="var(--accent-cyan)" />
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Performance vs Hike & Salary Slab Distribution */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {/* Performance vs Hike */}
        <div id="chart-performance-hike" className="glass-panel-noclick" style={{ padding: '24px', height: '380px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('chartPerfHikeTitle', lang)}
          </h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hikePerformanceData}
                margin={{ top: 10, right: isRtl ? -20 : 10, left: isRtl ? 10 : -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} tick={{ fontFamily: isRtl ? 'Tajawal' : 'inherit' }} />
                <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} orientation={isRtl ? 'right' : 'left'} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`, t('avgHikeLegend', lang)]} />
                <Bar dataKey="Avg Hike (%)" fill="var(--color-stayed)" radius={[4, 4, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salary Slab distribution with Attrition */}
        <div id="chart-salary-slab" className="glass-panel-noclick" style={{ padding: '24px', height: '380px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('chartSalarySlabTitle', lang)}
          </h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salarySlabData}
                margin={{ top: 10, right: isRtl ? -20 : 10, left: isRtl ? 10 : -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} tick={{ fontFamily: isRtl ? 'Tajawal' : 'inherit' }} />
                <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} orientation={isRtl ? 'right' : 'left'} />
                <Tooltip />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => (value === 'Stayed' ? t('legendStayed', lang) : t('legendLeft', lang))}
                />
                <Bar dataKey="Stayed" stackId="a" fill="var(--color-stayed)" barSize={40} name="Stayed" />
                <Bar dataKey="Left" stackId="a" fill="var(--color-left)" radius={[4, 4, 0, 0]} barSize={40} name="Left" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Income Growth by Tenure */}
      <div className="glass-panel-noclick" style={{ padding: '24px', height: '380px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
          {t('chartTenureIncomeTitle', lang)}
        </h3>
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={incomeTenureData}
              margin={{ top: 10, right: isRtl ? 20 : 20, left: isRtl ? 20 : 0, bottom: 15 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis 
                dataKey="years" 
                stroke="var(--text-dim)" 
                fontSize={12} 
                tickLine={false} 
                label={{ 
                  value: t('chartTenureAxisLabel', lang), 
                  position: 'insideBottom', 
                  offset: -5, 
                  fill: 'var(--text-dim)', 
                  fontSize: 11,
                  fontFamily: isRtl ? 'Tajawal' : 'inherit'
                }} 
              />
              <YAxis 
                stroke="var(--text-dim)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                orientation={isRtl ? 'right' : 'left'}
                tickFormatter={(value) => isRtl ? `${(value/1000).toLocaleString('ar-EG')} ${t('unitThousandEgp', lang)}` : `$${value/1000}${t('unitThousandsK', lang)}`}
              />
              <Tooltip formatter={(value) => [value ? (isRtl ? `${parseFloat(value.toString()).toLocaleString('ar-EG')} $` : `$${value.toLocaleString()}`) : '', t('avgIncomeLegend', lang)]} />
              <Line 
                type="monotone" 
                dataKey="Income" 
                stroke="var(--accent-cyan)" 
                strokeWidth={3}
                activeDot={{ r: 8 }}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
