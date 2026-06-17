import React, { useMemo } from 'react';
import type { Employee } from '../types/employee';
import { StatCard } from './StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GraduationCap, TrendingUp, Users, BookOpen } from 'lucide-react';
import type { Language } from '../utils/i18n';

interface TrainingTabProps { data: Employee[]; lang: Language; }

export const TrainingTab: React.FC<TrainingTabProps> = ({ data, lang }) => {
  const isRtl = lang === 'ar';

  const summary = useMemo(() => {
    const total = data.length;
    const avgTraining = (data.reduce((s, e) => s + e.TrainingTimesLastYear, 0) / total).toFixed(1);
    const trainedCount = data.filter(e => e.TrainingTimesLastYear > 0).length;
    const highTrainees = data.filter(e => e.TrainingTimesLastYear >= 5).length;
    return { total, avgTraining, trainedCount, highTrainees };
  }, [data]);

  const trainingDist = useMemo(() => {
    const groups = [{ label: '0', count: 0 }, { label: '1-2', count: 0 }, { label: '3-4', count: 0 }, { label: '5-6', count: 0 }, { label: '6+', count: 0 }];
    data.forEach(e => {
      if (e.TrainingTimesLastYear === 0) groups[0].count++;
      else if (e.TrainingTimesLastYear <= 2) groups[1].count++;
      else if (e.TrainingTimesLastYear <= 4) groups[2].count++;
      else if (e.TrainingTimesLastYear <= 6) groups[3].count++;
      else groups[4].count++;
    });
    return groups;
  }, [data]);

  const deptTraining = useMemo(() => {
    const m: Record<string, { count: number; training: number }> = {};
    data.forEach(e => { if (!m[e.Department]) m[e.Department] = { count: 0, training: 0 }; m[e.Department].count++; m[e.Department].training += e.TrainingTimesLastYear; });
    return Object.entries(m).map(([name, v]) => ({ name, avg: parseFloat((v.training / v.count).toFixed(1)), total: v.training }));
  }, [data]);

  const programs = [
    { name: isRtl ? 'القيادة' : 'Leadership', enrolled: 45, completed: 32 },
    { name: isRtl ? 'المهارات التقنية' : 'Technical Skills', enrolled: 60, completed: 48 },
    { name: isRtl ? 'الامتثال' : 'Compliance', enrolled: 85, completed: 80 },
    { name: isRtl ? 'المهارات الشخصية' : 'Soft Skills', enrolled: 40, completed: 28 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <StatCard id="tr-trained" title={isRtl ? 'موظفون مدربون' : 'Trained Employees'} value={`${summary.trainedCount}/${summary.total}`} subtitle={`${((summary.trainedCount / summary.total) * 100).toFixed(0)}%`} icon={<Users size={18} />} colorClass="text-emerald-400" />
        <StatCard id="tr-avg" title={isRtl ? 'متوسط الدورات' : 'Avg Training'} value={summary.avgTraining} subtitle={isRtl ? 'دورة/موظف' : 'sessions/employee'} icon={<GraduationCap size={18} />} colorClass="gradient-text" />
        <StatCard id="tr-high" title={isRtl ? 'متدربون مكثفون' : 'High Trainees (5+)'} value={summary.highTrainees} icon={<TrendingUp size={18} />} />
        <StatCard id="tr-programs" title={isRtl ? 'البرامج النشطة' : 'Active Programs'} value={programs.length} icon={<BookOpen size={18} />} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>{isRtl ? 'توزيع الدورات التدريبية' : 'Training Distribution'}</h3>
          <ResponsiveContainer width="100%" height={260}><BarChart data={trainingDist}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} /><YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} /><Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} /><Bar dataKey="count" name={isRtl ? 'الموظفين' : 'Employees'} fill="#8B5CF6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
        </div>
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>{isRtl ? 'التدريب حسب القسم' : 'Training by Department'}</h3>
          <ResponsiveContainer width="100%" height={260}><BarChart data={deptTraining}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} /><YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} /><Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} /><Bar dataKey="avg" name={isRtl ? 'متوسط' : 'Avg Sessions'} fill="#06B6D4" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
        </div>
      </div>
      <div className="glass-panel-noclick" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>{isRtl ? 'البرامج التدريبية' : 'Training Programs'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {programs.map((p, i) => (
            <div key={i} style={{ padding: '16px', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)', marginBottom: '8px' }}>
                <BookOpen size={14} style={{ marginRight: '6px', color: 'var(--accent-cyan)' }} />{p.name}
              </div>
              <div style={{ height: '6px', borderRadius: '3px', background: 'var(--border-color)', overflow: 'hidden', marginBottom: '6px' }}>
                <div style={{ height: '100%', width: `${(p.completed / p.enrolled) * 100}%`, background: '#10B981', borderRadius: '3px' }} />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                {p.completed}/{p.enrolled} {isRtl ? 'مكتمل' : 'completed'} • {((p.completed / p.enrolled) * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default TrainingTab;