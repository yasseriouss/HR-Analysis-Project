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
import { Star, GraduationCap, Trophy, Dumbbell, Target } from 'lucide-react';
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

  // 6. 9-Box Talent Matrix Data (based on screenshot 9 Box Dashboard.png)
  type NineBoxEmp = { id: string; name: string; dept: string; performance: number; potential: number; rating: number };
  const nineBoxData = useMemo(() => {
    const boxes: NineBoxEmp[][] = Array.from({ length: 9 }, () => []);
    data.forEach(e => {
      const perf = Math.max(1, Math.min(5, Math.round(((e.PerformanceRating - 3) / 1) * 5) || 3));
      const potential = Math.max(1, Math.min(5, Math.round((e.YearsAtCompany / 10 + Math.min(e.TrainingTimesLastYear, 5) / 5) * 5 / 2) || 3));
      const col = Math.min(3, Math.max(1, Math.ceil(perf / (5/3))));
      const row = Math.min(3, Math.max(1, Math.ceil(potential / (5/3))));
      const idx = (row - 1) * 3 + (col - 1);
      boxes[idx].push({
        id: e.EmpID,
        name: `#${e.EmployeeNumber}`,
        dept: e.Department,
        performance: perf,
        potential: potential,
        rating: e.PerformanceRating
      });
    });
    return boxes;
  }, [data]);

  const getBoxColor = (row: number, col: number) => {
    if (row === 3 && col === 3) return 'rgba(16, 185, 129, 0.15)'; // High/High - Green
    if (row === 3 && col === 2) return 'rgba(245, 158, 11, 0.15)'; // High/Med - Yellow
    if (row === 1 && col === 1) return 'rgba(239, 68, 68, 0.15)'; // Low/Low - Red
    return 'rgba(139, 92, 246, 0.08)'; // Others - Purple tint
  };

  const getBoxLabel = (row: number, col: number) => {
    const labels = [
      ['#9 Low Potential', '#8 Low Potential', '#7 Medium Potential'],
      ['#6 Low Potential', '#5 Medium Potential', '#4 High Potential'],
      ['#3 Low Potential', '#2 Medium Potential', '#1 High Potential']
    ];
    return labels[row-1][col-1];
  };

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
                  const employeesLabel = t('employeesUnit', lang);
                  return [`${value}% (${total.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')} ${employeesLabel})`, t('tableHeaderRate', lang)];
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

      {/* Phase 7.1: 9-Box Talent Matrix (from screenshots/9 Box Dashboard.png) */}
      <div className="glass-panel-noclick" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Target size={20} style={{ color: 'var(--accent-cyan)' }} />
              {isRtl ? 'مصفوفة المواهب (9 مربعات)' : '9-Box Talent Matrix'}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '4px 0 0' }}>
              {isRtl ? 'الأداء مقابل الإمكانات' : 'Performance vs Potential'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(16,185,129,0.3)' }} />
              {isRtl ? 'نجوم' : 'Stars'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(245,158,11,0.3)' }} />
              {isRtl ? 'أداء عالي' : 'High Perf'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(239,68,68,0.3)' }} />
              {isRtl ? 'ضعيف' : 'Low'}
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2px',
          background: 'var(--border-color)',
          borderRadius: '10px',
          overflow: 'hidden',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          {/* Y-axis label */}
          <div style={{
            gridRow: '1 / 4', gridColumn: '0',
            writingMode: 'vertical-rl', transform: 'rotate(180deg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600,
            padding: '8px', background: 'var(--bg-card)'
          }}>
            {isRtl ? 'الإمكانات ↑' : 'Potential ↑'}
          </div>

          {Array.from({ length: 9 }, (_, i) => {
            const row = 3 - Math.floor(i / 3); // top row = 3
            const col = (i % 3) + 1;
            const employees = nineBoxData[i];
            const boxColor = getBoxColor(row, col);
            return (
              <div
                key={i}
                style={{
                  background: boxColor,
                  padding: '12px',
                  minHeight: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(139,92,246,0.15)'}
                onMouseOut={e => e.currentTarget.style.background = boxColor}
                title={getBoxLabel(row, col)}
              >
                <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {getBoxLabel(row, col)}
                </div>
                <div style={{
                  flex: 1, display: 'flex', flexWrap: 'wrap', gap: '3px', alignItems: 'center', justifyContent: 'center'
                }}>
                  {employees.slice(0, 6).map((emp) => (
                    <div
                      key={emp.id}
                      style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        background: 'var(--accent-purple)',
                        border: '2px solid var(--border-focus)',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease',
                        position: 'relative'
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.transform = 'scale(1.4)';
                        e.currentTarget.style.zIndex = '10';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.zIndex = '1';
                      }}
                    >
                      <div style={{
                        position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
                        background: 'var(--bg-main)', border: '1px solid var(--border-color)',
                        padding: '4px 8px', borderRadius: '4px', fontSize: '10px', whiteSpace: 'nowrap',
                        color: 'var(--text-main)', pointerEvents: 'none', opacity: 0,
                        transition: 'opacity 0.15s', zIndex: 20
                      }}
                      onMouseOver={e => e.currentTarget.style.opacity = '1'}
                      onMouseOut={e => e.currentTarget.style.opacity = '0'}
                      >
                        {emp.name}
                      </div>
                    </div>
                  ))}
                  {employees.length > 6 && (
                    <span style={{ fontSize: '9px', color: 'var(--text-dim)', fontWeight: 600 }}>
                      +{employees.length - 6}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)', textAlign: 'center', fontWeight: 600 }}>
                  {employees.length} {isRtl ? 'موظف' : 'emp'}
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis label */}
        <div style={{
          textAlign: 'center', fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600, marginTop: '8px'
        }}>
          {isRtl ? 'الأداء ←' : 'Performance →'}
        </div>
      </div>
    </div>
  );
};
