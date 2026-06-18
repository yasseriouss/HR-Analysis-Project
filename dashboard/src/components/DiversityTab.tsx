import React, { useMemo } from 'react';
import type { Employee } from '../types/employee';
import { StatCard } from './StatCard';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, Percent, Award } from 'lucide-react';
import type { Language } from '../utils/i18n';

interface DiversityTabProps { data: Employee[]; lang: Language; }

export const DiversityTab: React.FC<DiversityTabProps> = ({ data, lang }) => {
  const isRtl = lang === 'ar';

  const summary = useMemo(() => ({
    gender: { male: data.filter(e => e.Gender === 'Male').length, female: data.filter(e => e.Gender === 'Female').length },
  }), [data]);

  const genderPie = [
    { name: isRtl ? 'ذكور' : 'Male', value: summary.gender.male, color: '#8B5CF6' },
    { name: isRtl ? 'إناث' : 'Female', value: summary.gender.female, color: '#EC4899' },
  ];

  const ageData = useMemo(() => {
    const groups = { '< 25': 0, '25-34': 0, '35-44': 0, '45-54': 0, '55+': 0 };
    data.forEach(e => {
      if (e.Age < 25) groups['< 25']++;
      else if (e.Age < 35) groups['25-34']++;
      else if (e.Age < 45) groups['35-44']++;
      else if (e.Age < 55) groups['45-54']++;
      else groups['55+']++;
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [data]);

  const genderDeptData = useMemo(() => {
    const depts = [...new Set(data.map(e => e.Department))];
    return depts.map(d => {
      const deptEmps = data.filter(e => e.Department === d);
      return {
        name: d,
        male: deptEmps.filter(e => e.Gender === 'Male').length,
        female: deptEmps.filter(e => e.Gender === 'Female').length,
      };
    });
  }, [data]);

  const educationData = useMemo(() => {
    const groups: Record<string, number> = {};
    data.forEach(e => { groups[e.EducationField] = (groups[e.EducationField] || 0) + 1; });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [data]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <StatCard id="div-male" title={isRtl ? 'ذكور' : 'Male'} value={`${summary.gender.male} (${((summary.gender.male / data.length) * 100).toFixed(0)}%)`} icon={<Users size={18} />} />
        <StatCard id="div-female" title={isRtl ? 'إناث' : 'Female'} value={`${summary.gender.female} (${((summary.gender.female / data.length) * 100).toFixed(0)}%)`} icon={<Users size={18} />} colorClass="text-pink-400" />
        <StatCard id="div-ratio" title={isRtl ? 'النسبة' : 'Gender Ratio'} value={`${((summary.gender.male / data.length) * 100).toFixed(0)}:${((summary.gender.female / data.length) * 100).toFixed(0)}`} icon={<Percent size={18} />} colorClass="gradient-text" />
        <StatCard id="div-depts" title={isRtl ? 'الأقسام' : 'Departments'} value={[...new Set(data.map(e => e.Department))].length} icon={<Award size={18} />} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        {/* Gender Pie */}
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>{isRtl ? 'توزيع الجنس' : 'Gender Distribution'}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart><Pie data={genderPie} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label>{genderPie.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} /></PieChart>
          </ResponsiveContainer>
        </div>

        {/* Age Distribution */}
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>{isRtl ? 'التوزيع العمري' : 'Age Distribution'}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ageData}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} /><YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} /><Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} /><Bar dataKey="value" name={isRtl ? 'الموظفين' : 'Employees'} fill="#8B5CF6" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender by Department */}
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>{isRtl ? 'الجنس حسب القسم' : 'Gender by Department'}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={genderDeptData}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} /><YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} /><Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} /><Legend />
              <Bar dataKey="male" name={isRtl ? 'ذكور' : 'Male'} fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="female" name={isRtl ? 'إناث' : 'Female'} fill="#EC4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Education Field */}
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>{isRtl ? 'التخصص الدراسي' : 'Education Field'}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart><Pie data={educationData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label>{educationData.map((_, i) => <Cell key={i} fill={['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'][i % 6]} />)}</Pie><Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} /></PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DiversityTab;