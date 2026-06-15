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
import { Percent, Milestone, Clock } from 'lucide-react';
import { t, translateValue } from '../utils/i18n';
import type { Language } from '../utils/i18n';

interface AttritionTabProps {
  data: Employee[];
  lang: Language;
}

export const AttritionTab: React.FC<AttritionTabProps> = ({ data, lang }) => {
  const isRtl = lang === 'ar';

  // 1. Calculate KPIs
  const kpis = useMemo(() => {
    const total = data.length;
    if (total === 0) {
      return { attritionRate: '0.0%', avgDistance: 0, overtimeRate: '0.0%' };
    }
    const left = data.filter(e => e.Attrition === 'Yes').length;
    const attritionRate = ((left / total) * 100).toFixed(1) + '%';
    
    const avgDistance = (data.reduce((acc, curr) => acc + curr.DistanceFromHome, 0) / total).toFixed(1);
    
    const overtimeCount = data.filter(e => e.OverTime === 'Yes').length;
    const overtimeRate = ((overtimeCount / total) * 100).toFixed(1) + '%';

    return { attritionRate, avgDistance, overtimeRate };
  }, [data]);

  // 2. Overtime distribution and attrition rate
  const overtimeData = useMemo(() => {
    const counts = {
      Yes: { total: 0, left: 0 },
      No: { total: 0, left: 0 }
    };
    data.forEach(e => {
      counts[e.OverTime].total++;
      if (e.Attrition === 'Yes') counts[e.OverTime].left++;
    });

    return [
      {
        name: translateValue('Works Overtime', lang),
        total: counts.Yes.total,
        Left: counts.Yes.left,
        Stayed: counts.Yes.total - counts.Yes.left,
        'Attrition Rate': counts.Yes.total > 0 ? Math.round((counts.Yes.left / counts.Yes.total) * 100) : 0
      },
      {
        name: translateValue('No Overtime', lang),
        total: counts.No.total,
        Left: counts.No.left,
        Stayed: counts.No.total - counts.No.left,
        'Attrition Rate': counts.No.total > 0 ? Math.round((counts.No.left / counts.No.total) * 100) : 0
      }
    ];
  }, [data, lang]);

  // 3. Attrition Rate by Distance from Home Slabs
  const distanceData = useMemo(() => {
    const slabs = [
      { name: 'Near (1-5 km)', total: 0, left: 0 },
      { name: 'Moderate (6-15 km)', total: 0, left: 0 },
      { name: 'Far (16-30 km)', total: 0, left: 0 }
    ];

    data.forEach(e => {
      let slabIndex = 0;
      if (e.DistanceFromHome <= 5) slabIndex = 0;
      else if (e.DistanceFromHome <= 15) slabIndex = 1;
      else slabIndex = 2;

      slabs[slabIndex].total++;
      if (e.Attrition === 'Yes') slabs[slabIndex].left++;
    });

    return slabs.map(s => ({
      name: translateValue(s.name, lang),
      'Attrition Rate (%)': s.total > 0 ? parseFloat(((s.left / s.total) * 100).toFixed(1)) : 0,
      Total: s.total
    }));
  }, [data, lang]);

  // 4. Attrition Rate by Age Group
  const ageGroupData = useMemo(() => {
    const order = ['18-25', '26-35', '36-45', '46-55', '55+'];
    const counts: { [key: string]: { total: 0; left: 0 } } = {};
    order.forEach(g => counts[g] = { total: 0, left: 0 });

    data.forEach(e => {
      if (counts[e.AgeGroup]) {
        counts[e.AgeGroup].total++;
        if (e.Attrition === 'Yes') counts[e.AgeGroup].left++;
      }
    });

    return order.map(group => ({
      name: translateValue(group, lang),
      'Attrition Rate (%)': counts[group].total > 0 ? parseFloat(((counts[group].left / counts[group].total) * 100).toFixed(1)) : 0
    }));
  }, [data, lang]);

  // 5. Promotion Timing vs Attrition (YearsSinceLastPromotion)
  const promotionData = useMemo(() => {
    const counts = {
      'Recently (0-2 Yrs)': { Stayed: 0, Left: 0 },
      'Mid (3-4 Yrs)': { Stayed: 0, Left: 0 },
      'Stagnant (5+ Yrs)': { Stayed: 0, Left: 0 }
    };

    data.forEach(e => {
      let slab: keyof typeof counts = 'Recently (0-2 Yrs)';
      if (e.YearsSinceLastPromotion <= 2) {
        slab = 'Recently (0-2 Yrs)';
      } else if (e.YearsSinceLastPromotion <= 4) {
        slab = 'Mid (3-4 Yrs)';
      } else {
        slab = 'Stagnant (5+ Yrs)';
      }

      if (e.Attrition === 'Yes') counts[slab].Left++;
      else counts[slab].Stayed++;
    });

    return Object.keys(counts).map(slab => ({
      name: translateValue(slab, lang),
      Stayed: counts[slab as keyof typeof counts].Stayed,
      Left: counts[slab as keyof typeof counts].Left
    }));
  }, [data, lang]);

  // 6. Attrition Matrix: Department & Job Role
  const matrixData = useMemo(() => {
    const matrix: { [key: string]: { total: number; left: number } } = {};
    data.forEach(e => {
      const key = `${e.Department} | ${e.JobRole}`;
      if (!matrix[key]) matrix[key] = { total: 0, left: 0 };
      matrix[key].total++;
      if (e.Attrition === 'Yes') matrix[key].left++;
    });

    return Object.keys(matrix).map(key => {
      const [dept, role] = key.split(' | ');
      const rate = ((matrix[key].left / matrix[key].total) * 100).toFixed(1);
      return {
        dept: dept === 'Research & Development' ? 'R&D' : dept,
        role,
        rate: parseFloat(rate),
        left: matrix[key].left,
        total: matrix[key].total
      };
    }).sort((a, b) => b.rate - a.rate); // Sort by attrition rate descending
  }, [data]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPIs Grid */}
      <div className="metrics-row">
        <StatCard 
          id="kpi-attrition-rate-detail"
          title={t('kpiAttritionRate', lang)} 
          value={isRtl ? kpis.attritionRate.replace('%', '٪') : kpis.attritionRate} 
          subtitle={t('kpiAttritionRateSub', lang)}
          icon={<Percent size={20} />} 
          colorClass="color-left-text"
          glowing={parseFloat(kpis.attritionRate) > 15}
          style={{ '--color-left-text': 'var(--color-left)' } as React.CSSProperties}
        />
        <StatCard 
          id="kpi-avg-distance"
          title={t('kpiAvgDistance', lang)} 
          value={isRtl ? `${parseFloat(kpis.avgDistance.toString()).toLocaleString('ar-EG')} كم` : `${kpis.avgDistance} km`} 
          subtitle={t('kpiAvgDistanceSub', lang)}
          icon={<Milestone size={20} />} 
        />
        <StatCard 
          id="kpi-overtime-rate"
          title={t('kpiOvertimeRate', lang)} 
          value={isRtl ? kpis.overtimeRate.replace('%', '٪') : kpis.overtimeRate} 
          subtitle={t('kpiOvertimeRateSub', lang)}
          icon={<Clock size={20} />} 
          colorClass="color-info-text"
          style={{ '--color-info-text': 'var(--color-info)' } as React.CSSProperties}
        />
      </div>

      {/* Row 1: Overtime & Commute Distance */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {/* Overtime Attrition */}
        <div id="chart-overtime-attrition" className="glass-panel-noclick" style={{ padding: '24px', height: '380px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('chartOvertimeTitle', lang)}
          </h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={overtimeData}
                margin={{ top: 10, right: isRtl ? -20 : 10, left: isRtl ? 10 : -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} tick={{ fontFamily: isRtl ? 'Tajawal' : 'inherit' }} />
                <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} orientation={isRtl ? 'right' : 'left'} />
                <Tooltip formatter={(value) => [`${value}%`, t('tableHeaderRate', lang)]} />
                <Bar dataKey="Attrition Rate" fill="var(--color-left)" radius={[4, 4, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Commute Distance Attrition */}
        <div id="chart-distance-attrition" className="glass-panel-noclick" style={{ padding: '24px', height: '380px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('chartDistanceTitle', lang)}
          </h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={distanceData}
                margin={{ top: 10, right: isRtl ? 10 : 20, left: isRtl ? 20 : -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} tick={{ fontFamily: isRtl ? 'Tajawal' : 'inherit' }} />
                <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} orientation={isRtl ? 'right' : 'left'} />
                <Tooltip formatter={(value) => [`${value}%`, t('tableHeaderRate', lang)]} />
                <Line 
                  type="monotone" 
                  dataKey="Attrition Rate (%)" 
                  stroke="var(--accent-purple)" 
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                  dot={{ r: 5, fill: 'var(--accent-cyan)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Age Group Attrition Rate & Promotion Timing */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {/* Attrition Rate by Age Group */}
        <div id="chart-age-attrition-rate" className="glass-panel-noclick" style={{ padding: '24px', height: '380px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('chartAgeRateTitle', lang)}
          </h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ageGroupData}
                margin={{ top: 10, right: isRtl ? -20 : 10, left: isRtl ? 10 : -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} tick={{ fontFamily: isRtl ? 'Tajawal' : 'inherit' }} />
                <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} orientation={isRtl ? 'right' : 'left'} />
                <Tooltip formatter={(value) => [`${value}%`, t('tableHeaderRate', lang)]} />
                <Bar dataKey="Attrition Rate (%)" fill="var(--accent-cyan)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Promotion Timing vs Attrition */}
        <div id="chart-promotion-attrition" className="glass-panel-noclick" style={{ padding: '24px', height: '380px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('chartPromotionTitle', lang)}
          </h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={promotionData}
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

      {/* Attrition Matrix Table */}
      <div className="glass-panel-noclick" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
          {t('tableMatrixTitle', lang)}
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table 
            id="attrition-matrix-table"
            style={{ 
              width: '100%', 
              borderCollapse: 'collapse', 
              fontSize: '14px', 
              textAlign: isRtl ? 'right' : 'left',
              fontFamily: 'var(--font-family)'
            }}
          >
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px', textAlign: isRtl ? 'right' : 'left' }}>{t('tableHeaderDept', lang)}</th>
                <th style={{ padding: '12px 16px', textAlign: isRtl ? 'right' : 'left' }}>{t('tableHeaderRole', lang)}</th>
                <th style={{ padding: '12px 16px', textAlign: isRtl ? 'left' : 'right' }}>{t('tableHeaderRate', lang)}</th>
                <th style={{ padding: '12px 16px', textAlign: isRtl ? 'left' : 'right' }}>{t('tableHeaderLeft', lang)}</th>
                <th style={{ padding: '12px 16px', textAlign: isRtl ? 'left' : 'right' }}>{t('tableHeaderTotal', lang)}</th>
              </tr>
            </thead>
            <tbody>
              {matrixData.slice(0, 8).map((row, idx) => {
                let badgeColor = 'rgba(255, 255, 255, 0.05)';
                let textColor = 'var(--text-main)';
                if (row.rate >= 25) {
                  badgeColor = 'hsla(342, 85%, 55%, 0.1)';
                  textColor = 'var(--color-left)';
                } else if (row.rate >= 15) {
                  badgeColor = 'hsla(45, 90%, 55%, 0.1)';
                  textColor = 'var(--color-warning)';
                } else {
                  badgeColor = 'hsla(142, 72%, 45%, 0.1)';
                  textColor = 'var(--color-stayed)';
                }

                return (
                  <tr 
                    key={idx} 
                    style={{ 
                      borderBottom: '1px solid var(--border-color)',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{translateValue(row.dept, lang)}</td>
                    <td style={{ padding: '12px 16px' }}>{translateValue(row.role, lang)}</td>
                    <td style={{ padding: '12px 16px', textAlign: isRtl ? 'left' : 'right' }}>
                      <span 
                        style={{
                          backgroundColor: badgeColor,
                          color: textColor,
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontWeight: 700
                        }}
                      >
                        {isRtl ? `${row.rate.toLocaleString('ar-EG')}٪` : `${row.rate}%`}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: isRtl ? 'left' : 'right', fontWeight: 500 }}>
                      {row.left.toLocaleString(isRtl ? 'ar-EG' : 'en-US')}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: isRtl ? 'left' : 'right', color: 'var(--text-muted)' }}>
                      {row.total.toLocaleString(isRtl ? 'ar-EG' : 'en-US')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
