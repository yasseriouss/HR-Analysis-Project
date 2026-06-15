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
import { Users, UserMinus, UserCheck, CalendarDays, Percent } from 'lucide-react';
import { t, translateValue } from '../utils/i18n';
import type { Language } from '../utils/i18n';

interface OverviewTabProps {
  data: Employee[];
  lang: Language;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ data, lang }) => {
  const isRtl = lang === 'ar';

  // 1. Calculate KPIs
  const kpis = useMemo(() => {
    const total = data.length;
    if (total === 0) {
      return { total: 0, attritionRate: '0.0%', left: 0, stayed: 0, avgAge: 0 };
    }
    const left = data.filter(e => e.Attrition === 'Yes').length;
    const stayed = total - left;
    const attritionRate = ((left / total) * 100).toFixed(1) + '%';
    const avgAge = Math.round(data.reduce((acc, curr) => acc + curr.Age, 0) / total);

    return { total, attritionRate, left, stayed, avgAge };
  }, [data]);

  // 2. Chart Aggregations
  // Gender Donut Chart Data
  const genderData = useMemo(() => {
    const counts: { [key: string]: { Stayed: number; Left: number } } = {};
    data.forEach(e => {
      if (!counts[e.Gender]) counts[e.Gender] = { Stayed: 0, Left: 0 };
      if (e.Attrition === 'Yes') counts[e.Gender].Left++;
      else counts[e.Gender].Stayed++;
    });

    return Object.keys(counts).map(gender => ({
      name: translateValue(gender, lang),
      Stayed: counts[gender].Stayed,
      Left: counts[gender].Left,
      value: counts[gender].Stayed + counts[gender].Left
    }));
  }, [data, lang]);

  // Marital Status Stacked Bar Chart
  const maritalData = useMemo(() => {
    const counts: { [key: string]: { Stayed: number; Left: number } } = {
      Single: { Stayed: 0, Left: 0 },
      Married: { Stayed: 0, Left: 0 },
      Divorced: { Stayed: 0, Left: 0 }
    };
    data.forEach(e => {
      if (counts[e.MaritalStatus]) {
        if (e.Attrition === 'Yes') counts[e.MaritalStatus].Left++;
        else counts[e.MaritalStatus].Stayed++;
      }
    });
    return Object.keys(counts).map(status => ({
      name: translateValue(status, lang),
      Stayed: counts[status].Stayed,
      Left: counts[status].Left
    }));
  }, [data, lang]);

  // Department Bar Chart
  const deptData = useMemo(() => {
    const counts: { [key: string]: { Stayed: number; Left: number } } = {};
    data.forEach(e => {
      if (!counts[e.Department]) counts[e.Department] = { Stayed: 0, Left: 0 };
      if (e.Attrition === 'Yes') counts[e.Department].Left++;
      else counts[e.Department].Stayed++;
    });
    return Object.keys(counts).map(dept => ({
      name: translateValue(dept === 'Research & Development' ? 'R&D' : dept, lang),
      Stayed: counts[dept].Stayed,
      Left: counts[dept].Left
    }));
  }, [data, lang]);

  // Age Group Bar Chart
  const ageGroupData = useMemo(() => {
    const order = ['18-25', '26-35', '36-45', '46-55', '55+'];
    const counts: { [key: string]: { Stayed: number; Left: number } } = {};
    order.forEach(g => counts[g] = { Stayed: 0, Left: 0 });

    data.forEach(e => {
      if (counts[e.AgeGroup]) {
        if (e.Attrition === 'Yes') counts[e.AgeGroup].Left++;
        else counts[e.AgeGroup].Stayed++;
      }
    });

    return order.map(group => ({
      name: translateValue(group, lang),
      Stayed: counts[group].Stayed,
      Left: counts[group].Left
    }));
  }, [data, lang]);

  // Education Field Chart
  const eduFieldData = useMemo(() => {
    const counts: { [key: string]: { Stayed: number; Left: number } } = {};
    data.forEach(e => {
      if (!counts[e.EducationField]) counts[e.EducationField] = { Stayed: 0, Left: 0 };
      if (e.Attrition === 'Yes') counts[e.EducationField].Left++;
      else counts[e.EducationField].Stayed++;
    });
    return Object.keys(counts).map(field => ({
      name: translateValue(field, lang),
      Stayed: counts[field].Stayed,
      Left: counts[field].Left
    })).sort((a, b) => (b.Stayed + b.Left) - (a.Stayed + a.Left));
  }, [data, lang]);

  // Colors for Pie Chart
  const PIE_COLORS = ['hsl(185, 90%, 50%)', 'hsl(263, 90%, 65%)'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPIs Grid */}
      <div className="metrics-row">
        <StatCard 
          id="kpi-total-employees"
          title={t('kpiTotalEmployees', lang)} 
          value={kpis.total.toLocaleString(isRtl ? 'ar-EG' : 'en-US')} 
          subtitle={t('kpiTotalEmployeesSub', lang)}
          icon={<Users size={20} />} 
        />
        <StatCard 
          id="kpi-attrition-rate"
          title={t('kpiAttritionRate', lang)} 
          value={kpis.attritionRate} 
          subtitle={t('kpiAttritionRateSub', lang)}
          icon={<Percent size={20} />} 
          colorClass="color-left-text"
          glowing={parseFloat(kpis.attritionRate) > 15}
          style={{ '--color-left-text': 'var(--color-left)' } as React.CSSProperties}
        />
        <StatCard 
          id="kpi-employees-left"
          title={t('kpiEmployeesLeft', lang)} 
          value={kpis.left.toLocaleString(isRtl ? 'ar-EG' : 'en-US')} 
          subtitle={t('kpiEmployeesLeftSub', lang)}
          icon={<UserMinus size={20} />} 
          colorClass="color-left-text"
          style={{ '--color-left-text': 'var(--color-left)' } as React.CSSProperties}
        />
        <StatCard 
          id="kpi-employees-stayed"
          title={t('kpiEmployeesStayed', lang)} 
          value={kpis.stayed.toLocaleString(isRtl ? 'ar-EG' : 'en-US')} 
          subtitle={t('kpiEmployeesStayedSub', lang)}
          icon={<UserCheck size={20} />} 
          colorClass="color-stayed-text"
          style={{ '--color-stayed-text': 'var(--color-stayed)' } as React.CSSProperties}
        />
        <StatCard 
          id="kpi-average-age"
          title={t('kpiAverageAge', lang)} 
          value={kpis.avgAge.toLocaleString(isRtl ? 'ar-EG' : 'en-US')} 
          subtitle={t('kpiAverageAgeSub', lang)}
          icon={<CalendarDays size={20} />} 
        />
      </div>

      {/* Charts Row 1: Gender & Marital Status */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {/* Gender Distribution Donut */}
        <div id="chart-gender" className="glass-panel-noclick" style={{ padding: '24px', height: '380px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('chartGenderTitle', lang)}
          </h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {genderData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, _name: any, props: any) => {
                    const payload = props.payload;
                    const stayedText = t('legendStayed', lang);
                    const leftText = t('legendLeft', lang);
                    const headcountLabel = t('headcount', lang);
                    return [`${value} (${stayedText}: ${payload.Stayed}, ${leftText}: ${payload.Left})`, headcountLabel];
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Summary Text */}
            <div style={{
              position: 'absolute',
              top: '44%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none'
            }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'Outfit' }}>
                {kpis.total.toLocaleString(isRtl ? 'ar-EG' : 'en-US')}
              </span>
              <br />
              <span style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: isRtl ? 'normal' : '0.05em', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
                {t('employeesUnit', lang)}
              </span>
            </div>
          </div>
        </div>

        {/* Marital Status Stacked Bar */}
        <div id="chart-marital" className="glass-panel-noclick" style={{ padding: '24px', height: '380px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('chartMaritalTitle', lang)}
          </h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={maritalData}
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

      {/* Charts Row 2: Department & Age Group */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        {/* Department Bar Chart */}
        <div id="chart-department" className="glass-panel-noclick" style={{ padding: '24px', height: '380px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('chartDeptTitle', lang)}
          </h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={deptData}
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
                <Bar dataKey="Stayed" stackId="a" fill="var(--color-stayed)" barSize={45} name="Stayed" />
                <Bar dataKey="Left" stackId="a" fill="var(--color-left)" radius={[4, 4, 0, 0]} barSize={45} name="Left" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age Group Chart */}
        <div id="chart-age-group" className="glass-panel-noclick" style={{ padding: '24px', height: '380px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('chartAgeTitle', lang)}
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
                <Tooltip />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => (value === 'Stayed' ? t('legendStayed', lang) : t('legendLeft', lang))}
                />
                <Bar dataKey="Stayed" stackId="a" fill="var(--color-stayed)" barSize={35} name="Stayed" />
                <Bar dataKey="Left" stackId="a" fill="var(--color-left)" radius={[4, 4, 0, 0]} barSize={35} name="Left" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 3: Education Field */}
      <div className="glass-panel-noclick" style={{ padding: '24px', height: '400px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
          {t('chartEduFieldTitle', lang)}
        </h3>
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={eduFieldData}
              margin={{ top: 10, right: isRtl ? 40 : 10, left: isRtl ? 10 : 40, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
              <XAxis type="number" stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="var(--text-main)" 
                fontSize={12} 
                tickLine={false} 
                width={120} 
                orientation={isRtl ? 'right' : 'left'}
                tick={{ fontFamily: isRtl ? 'Tajawal' : 'inherit' }}
              />
              <Tooltip />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                formatter={(value) => (value === 'Stayed' ? t('legendStayed', lang) : t('legendLeft', lang))}
              />
              <Bar dataKey="Stayed" stackId="a" fill="var(--color-stayed)" barSize={20} name="Stayed" />
              <Bar dataKey="Left" stackId="a" fill="var(--color-left)" radius={[0, 4, 4, 0]} barSize={20} name="Left" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
export default OverviewTab;
