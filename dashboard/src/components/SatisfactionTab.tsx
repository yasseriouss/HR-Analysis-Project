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
  ResponsiveContainer 
} from 'recharts';
import { Smile, Briefcase, Landmark, ShieldCheck } from 'lucide-react';
import { t, translateValue } from '../utils/i18n';
import type { Language } from '../utils/i18n';

interface SatisfactionTabProps {
  data: Employee[];
  lang: Language;
}

export const SatisfactionTab: React.FC<SatisfactionTabProps> = ({ data, lang }) => {
  const isRtl = lang === 'ar';

  // 1. Calculate KPIs
  const kpis = useMemo(() => {
    const total = data.length;
    if (total === 0) {
      return { avgSatisfaction: 0, avgTenure: 0, avgCurrentRole: 0, attritionRate: '0.0%' };
    }
    const sumSatisfaction = data.reduce((acc, curr) => acc + curr.JobSatisfaction, 0);
    const avgSatisfaction = (sumSatisfaction / total).toFixed(2);
    
    const sumTenure = data.reduce((acc, curr) => acc + curr.YearsAtCompany, 0);
    const avgTenure = (sumTenure / total).toFixed(1);

    const sumCurrentRole = data.reduce((acc, curr) => acc + curr.YearsInCurrentRole, 0);
    const avgCurrentRole = (sumCurrentRole / total).toFixed(1);

    const left = data.filter(e => e.Attrition === 'Yes').length;
    const attritionRate = ((left / total) * 100).toFixed(1) + '%';

    return { avgSatisfaction, avgTenure, avgCurrentRole, attritionRate };
  }, [data]);

  // 2. Job Satisfaction Category Distribution
  const jobSatisfactionData = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    data.forEach(e => {
      const score = e.JobSatisfaction as 1 | 2 | 3 | 4;
      if (counts[score] !== undefined) counts[score]++;
    });

    const total = data.length || 1;
    const labels = { 1: 'Low', 2: 'Medium', 3: 'High', 4: 'Very High' };

    return [1, 2, 3, 4].map(score => ({
      name: translateValue(labels[score as 1 | 2 | 3 | 4], lang),
      Percentage: parseFloat(((counts[score as 1 | 2 | 3 | 4] / total) * 100).toFixed(1)),
      Count: counts[score as 1 | 2 | 3 | 4]
    }));
  }, [data, lang]);

  // 3. Environment Satisfaction by Attrition Rate
  const envSatisfactionData = useMemo(() => {
    const stats: { [key: number]: { total: number; left: number } } = {
      1: { total: 0, left: 0 },
      2: { total: 0, left: 0 },
      3: { total: 0, left: 0 },
      4: { total: 0, left: 0 }
    };

    data.forEach(e => {
      if (stats[e.EnvironmentSatisfaction]) {
        stats[e.EnvironmentSatisfaction].total++;
        if (e.Attrition === 'Yes') stats[e.EnvironmentSatisfaction].left++;
      }
    });

    const labels = { 1: 'Low', 2: 'Medium', 3: 'High', 4: 'Very High' };

    return [1, 2, 3, 4].map(score => ({
      name: translateValue(labels[score as 1 | 2 | 3 | 4], lang),
      'Attrition Rate (%)': stats[score].total > 0 ? parseFloat(((stats[score].left / stats[score].total) * 100).toFixed(1)) : 0
    }));
  }, [data, lang]);

  // 4. Relationship Satisfaction Category
  const relSatisfactionData = useMemo(() => {
    const stats: { [key: number]: { total: number; left: number } } = {
      1: { total: 0, left: 0 },
      2: { total: 0, left: 0 },
      3: { total: 0, left: 0 },
      4: { total: 0, left: 0 }
    };

    data.forEach(e => {
      if (stats[e.RelationshipSatisfaction]) {
        stats[e.RelationshipSatisfaction].total++;
        if (e.Attrition === 'Yes') stats[e.RelationshipSatisfaction].left++;
      }
    });

    const labels = { 1: 'Low', 2: 'Medium', 3: 'High', 4: 'Very High' };

    return [1, 2, 3, 4].map(score => ({
      name: translateValue(labels[score as 1 | 2 | 3 | 4], lang),
      'Attrition Rate (%)': stats[score].total > 0 ? parseFloat(((stats[score].left / stats[score].total) * 100).toFixed(1)) : 0
    }));
  }, [data, lang]);

  // 5. Stock Option Category by Attrition Count
  const stockOptionData = useMemo(() => {
    const stats: { [key: number]: { Stayed: number; Left: number } } = {
      0: { Stayed: 0, Left: 0 },
      1: { Stayed: 0, Left: 0 },
      2: { Stayed: 0, Left: 0 },
      3: { Stayed: 0, Left: 0 }
    };

    data.forEach(e => {
      if (stats[e.StockOptionLevel]) {
        if (e.Attrition === 'Yes') stats[e.StockOptionLevel].Left++;
        else stats[e.StockOptionLevel].Stayed++;
      }
    });

    const labels = isRtl ? {
      0: 'بدون أسهم',
      1: 'أساسي (مستوى 1)',
      2: 'متوسط (مستوى 2)',
      3: 'تنفيذي (مستوى 3)'
    } : {
      0: 'No Stock Options',
      1: 'Basic (Level 1)',
      2: 'Higher (Level 2)',
      3: 'Executive (Level 3)'
    };

    return [0, 1, 2, 3].map(lvl => ({
      name: labels[lvl as 0 | 1 | 2 | 3],
      Stayed: stats[lvl].Stayed,
      Left: stats[lvl].Left
    }));
  }, [data, isRtl]);

  // 6. Attrition Rate by Business Travel Frequency
  const travelData = useMemo(() => {
    const stats: { [key: string]: { total: number; left: number } } = {
      Travel_Frequently: { total: 0, left: 0 },
      Travel_Rarely: { total: 0, left: 0 },
      'Non-Travel': { total: 0, left: 0 }
    };

    data.forEach(e => {
      if (stats[e.BusinessTravel]) {
        stats[e.BusinessTravel].total++;
        if (e.Attrition === 'Yes') stats[e.BusinessTravel].left++;
      }
    });

    return Object.keys(stats).map(key => ({
      name: translateValue(key, lang),
      'Attrition Rate (%)': stats[key].total > 0 ? parseFloat(((stats[key].left / stats[key].total) * 100).toFixed(1)) : 0
    }));
  }, [data, lang]);

  // 7. Work Life Balance by Attrition
  const workLifeData = useMemo(() => {
    const stats: { [key: number]: { Stayed: number; Left: number } } = {
      1: { Stayed: 0, Left: 0 },
      2: { Stayed: 0, Left: 0 },
      3: { Stayed: 0, Left: 0 },
      4: { Stayed: 0, Left: 0 }
    };

    data.forEach(e => {
      if (stats[e.WorkLifeBalance]) {
        if (e.Attrition === 'Yes') stats[e.WorkLifeBalance].Left++;
        else stats[e.WorkLifeBalance].Stayed++;
      }
    });

    const labelKeys = {
      1: 'wlPoor' as const,
      2: 'wlFair' as const,
      3: 'wlGood' as const,
      4: 'wlEx' as const
    };

    return [1, 2, 3, 4].map(score => ({
      name: t(labelKeys[score as 1 | 2 | 3 | 4], lang),
      Stayed: stats[score].Stayed,
      Left: stats[score].Left
    }));
  }, [data, lang]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPIs Grid */}
      <div className="metrics-row">
        <StatCard 
          id="kpi-avg-satisfaction"
          title={t('kpiAvgSatisfaction', lang)} 
          value={isRtl ? `${parseFloat(kpis.avgSatisfaction.toString()).toLocaleString('ar-EG')} / ٤` : `${kpis.avgSatisfaction} / 4`} 
          subtitle={t('kpiAvgSatisfactionSub', lang)}
          icon={<Smile size={20} />} 
          colorClass="gradient-text"
          glowing={true}
        />
        <StatCard 
          id="kpi-avg-tenure-satisfaction"
          title={t('kpiAvgTenure', lang)} 
          value={isRtl ? `${parseFloat(kpis.avgTenure.toString()).toLocaleString('ar-EG')} سنة` : `${kpis.avgTenure} Yrs`} 
          subtitle={t('kpiAvgTenureSub', lang)}
          icon={<Briefcase size={20} />} 
        />
        <StatCard 
          id="kpi-avg-years-role"
          title={t('kpiAvgYearsRole', lang)} 
          value={isRtl ? `${parseFloat(kpis.avgCurrentRole.toString()).toLocaleString('ar-EG')} سنة` : `${kpis.avgCurrentRole} Yrs`} 
          subtitle={t('kpiAvgYearsRoleSub', lang)}
          icon={<Landmark size={20} />} 
        />
        <StatCard 
          id="kpi-attrition-rate-satisfaction"
          title={t('kpiAttritionRate', lang)} 
          value={isRtl ? kpis.attritionRate.replace('%', '٪') : kpis.attritionRate} 
          subtitle={t('kpiAttritionRateSub', lang)}
          icon={<ShieldCheck size={20} />} 
          colorClass="color-left-text"
          style={{ '--color-left-text': 'var(--color-left)' } as React.CSSProperties}
        />
      </div>

      {/* Row 1: Job Satisfaction & Environment Satisfaction */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {/* Job Satisfaction Category */}
        <div id="chart-job-satisfaction" className="glass-panel-noclick" style={{ padding: '24px', height: '380px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('chartJobSatTitle', lang)}
          </h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={jobSatisfactionData}
                margin={{ top: 10, right: isRtl ? -20 : 10, left: isRtl ? 10 : -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} tick={{ fontFamily: isRtl ? 'Tajawal' : 'inherit' }} />
                <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} orientation={isRtl ? 'right' : 'left'} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value, _name, props) => {
                  const count = props.payload?.Count ?? 0;
                  const employeesLabel = t('employeesUnit', lang);
                  const distLabel = t('distribution', lang);
                  const valStr = value !== undefined && value !== null ? (isRtl ? parseFloat(value.toString()).toLocaleString('ar-EG') : value) : '';
                  return [`${valStr}% (${count.toLocaleString(isRtl ? 'ar-EG' : 'en-US')} ${employeesLabel})`, distLabel];
                }} />
                <Bar dataKey="Percentage" fill="var(--accent-purple)" radius={[4, 4, 0, 0]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Environment Satisfaction vs Attrition */}
        <div id="chart-environment-satisfaction" className="glass-panel-noclick" style={{ padding: '24px', height: '380px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('chartEnvSatTitle', lang)}
          </h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={envSatisfactionData}
                margin={{ top: 10, right: isRtl ? -20 : 10, left: isRtl ? 10 : -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} tick={{ fontFamily: isRtl ? 'Tajawal' : 'inherit' }} />
                <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} orientation={isRtl ? 'right' : 'left'} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`, t('tableHeaderRate', lang)]} />
                <Bar dataKey="Attrition Rate (%)" fill="var(--color-left)" radius={[4, 4, 0, 0]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Relationship Satisfaction & Stock Options */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {/* Relationship Satisfaction */}
        <div id="chart-relationship-satisfaction" className="glass-panel-noclick" style={{ padding: '24px', height: '380px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('chartRelSatTitle', lang)}
          </h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={relSatisfactionData}
                margin={{ top: 10, right: isRtl ? -20 : 10, left: isRtl ? 10 : -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} tick={{ fontFamily: isRtl ? 'Tajawal' : 'inherit' }} />
                <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} orientation={isRtl ? 'right' : 'left'} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`, t('tableHeaderRate', lang)]} />
                <Bar dataKey="Attrition Rate (%)" fill="var(--accent-cyan)" radius={[4, 4, 0, 0]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Option Level */}
        <div id="chart-stock-options" className="glass-panel-noclick" style={{ padding: '24px', height: '380px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('chartStockOptionTitle', lang)}
          </h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stockOptionData}
                margin={{ top: 10, right: isRtl ? -20 : 10, left: isRtl ? 10 : -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={11} tickLine={false} tick={{ fontFamily: isRtl ? 'Tajawal' : 'inherit' }} />
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

      {/* Row 3: Work Life Balance & Business Travel */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {/* Work Life Balance */}
        <div id="chart-work-life-balance" className="glass-panel-noclick" style={{ padding: '24px', height: 380, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('chartWorkLifeTitle', lang)}
          </h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={workLifeData}
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

        {/* Business Travel */}
        <div id="chart-business-travel" className="glass-panel-noclick" style={{ padding: '24px', height: 380, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('chartTravelAttrTitle', lang)}
          </h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={travelData}
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
      </div>
    </div>
  );
};
