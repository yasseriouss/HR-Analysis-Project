import React, { useMemo, useState } from 'react';
import type { CandidateStage } from '../types/recruitment';
import { CANDIDATE_STAGE_LABELS, SOURCE_LABELS } from '../types/recruitment';
import { StatCard } from './StatCard';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Briefcase, Users, TrendingUp, Clock, Star } from 'lucide-react';
import type { Language } from '../utils/i18n';

interface RecruitmentTabProps { lang: Language; }

function generateData() {
  const jobs = [
    { id: 'JOB-1', title: 'Senior React Developer', department: 'IT', location: 'Cairo', applicants: 24 },
    { id: 'JOB-2', title: 'HR Business Partner', department: 'Human Resources', location: 'Alexandria', applicants: 18 },
    { id: 'JOB-3', title: 'Data Analyst', department: 'Sales', location: 'Remote', applicants: 12 },
  ];
  const stages: CandidateStage[] = ['sourced', 'screening', 'interview', 'offer', 'hired', 'rejected'];
  const sources: Array<'linkedin' | 'website' | 'referral' | 'agency' | 'other'> = ['linkedin', 'website', 'referral', 'agency', 'other'];
  const names = ['Ahmed Hassan','Sarah Ibrahim','Mohamed Ali','Nour Ahmed','Omar Khalid','Layla Mahmoud','Fatima Nasser','Hassan Youssef','Aisha Tarek','Youssef Samir','Kareem Adel','Dina Salah','Tarek Fathy','Mona Zaki','Ramy Essam'];
  const skills = ['React','TypeScript','Python','SQL','HRIS','Recruitment','Data Analysis','Team Mgmt','Leadership','Node.js','AWS','Communication'];
  const cands: any[] = [];
  jobs.forEach(job => {
    for (let i = 0; i < job.applicants; i++) {
      cands.push({ id: `${job.id}-C${i+1}`, jobId: job.id, jobTitle: job.title, name: names[i%names.length],
        stage: stages[i%stages.length], appliedDate: `2026-06-${String((i%30)+1).padStart(2,'0')}`,
        experience: 2+(i%10), skills: [skills[i%skills.length],skills[(i+1)%skills.length]],
        source: sources[i%sources.length], rating: 2+(i%4),
      });
    }
  });
  return { jobs, candidates: cands };
}

const STAGE_ORDER: CandidateStage[] = ['sourced', 'screening', 'interview', 'offer', 'hired', 'rejected'];

export const RecruitmentTab: React.FC<RecruitmentTabProps> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const [selectedJob, setSelectedJob] = useState('JOB-1');
  const { jobs, candidates } = useMemo(() => generateData(), []);
  const jobCandidates = useMemo(() => candidates.filter((c: any) => c.jobId === selectedJob), [candidates, selectedJob]);

  const summary = useMemo(() => ({
    totalJobs: jobs.length, totalCandidates: candidates.length,
    avgRating: (candidates.reduce((s: number, c: any) => s + c.rating, 0) / candidates.length).toFixed(1),
    hired: candidates.filter((c: any) => c.stage === 'hired').length,
    timeToHire: '18 days',
  }), [candidates]);

  const sourceData = useMemo(() => {
    const m: Record<string, number> = {};
    candidates.forEach((c: any) => { m[c.source] = (m[c.source] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name: SOURCE_LABELS[name as keyof typeof SOURCE_LABELS][lang], value }));
  }, [candidates, lang]);

  const stageCounts = useMemo(() => {
    return STAGE_ORDER.map(stage => ({
      stage, count: jobCandidates.filter((c: any) => c.stage === stage).length,
      label: CANDIDATE_STAGE_LABELS[stage][lang], color: CANDIDATE_STAGE_LABELS[stage].color
    }));
  }, [jobCandidates, lang]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        <StatCard id="ats-jobs" title={isRtl ? 'الوظائف المفتوحة' : 'Open Jobs'} value={summary.totalJobs} icon={<Briefcase size={18} />} />
        <StatCard id="ats-candidates" title={isRtl ? 'إجمالي المرشحين' : 'Total Candidates'} value={summary.totalCandidates} icon={<Users size={18} />} />
        <StatCard id="ats-rating" title={isRtl ? 'متوسط التقييم' : 'Avg Rating'} value={`${summary.avgRating}/5`} icon={<Star size={18} />} colorClass="gradient-text" />
        <StatCard id="ats-hired" title={isRtl ? 'تم التعيين' : 'Hired'} value={summary.hired} icon={<TrendingUp size={18} />} colorClass="text-emerald-400" />
        <StatCard id="ats-ttf" title={isRtl ? 'وقت التوظيف' : 'Time to Hire'} value={summary.timeToHire} icon={<Clock size={18} />} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>{isRtl ? 'مصدر المرشحين' : 'Candidate Source'}</h3>
          <ResponsiveContainer width="100%" height={250}><PieChart><Pie data={sourceData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label>{sourceData.map((_:any,i:number) => <Cell key={i} fill={['#8B5CF6','#06B6D4','#10B981','#F59E0B','#EF4444'][i%5]} />)}</Pie><Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} /></PieChart></ResponsiveContainer>
        </div>
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <select value={selectedJob} onChange={e => setSelectedJob(e.target.value)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '6px 12px', borderRadius: '8px', fontSize: '13px' }}>
              {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={250}><BarChart data={stageCounts}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} /><YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} /><Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} /><Bar dataKey="count" name={isRtl ? 'المرشحين' : 'Candidates'} radius={[4, 4, 0, 0]}>{stageCounts.map((s:any,i:number) => <Cell key={i} fill={s.color} />)}</Bar></BarChart></ResponsiveContainer>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STAGE_ORDER.length}, 1fr)`, gap: '12px', overflowX: 'auto', minWidth: '900px' }}>
        {STAGE_ORDER.map(stage => {
          const stageCands = jobCandidates.filter((c:any) => c.stage === stage);
          const stageInfo = CANDIDATE_STAGE_LABELS[stage];
          return (
            <div key={stage} style={{ padding: '12px', borderRadius: '10px', background: `${stageInfo.color}08`, border: `1px solid ${stageInfo.color}30` }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: stageInfo.color, marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span>{stageInfo[lang]}</span><span style={{ background: stageInfo.color + '20', padding: '1px 6px', borderRadius: '8px', fontSize: '11px' }}>{stageCands.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {stageCands.map((c:any) => (
                  <div key={c.id} style={{ padding: '10px', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-main)' }}>{c.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{c.experience}y exp • {SOURCE_LABELS[c.source as keyof typeof SOURCE_LABELS][lang]}</div>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                      {c.skills.slice(0,2).map((s:string) => <span key={s} style={{ padding: '1px 6px', borderRadius: '4px', fontSize: '9px', background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}>{s}</span>)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                      <span style={{ color: '#F59E0B', fontSize: '11px' }}>{'★'.repeat(c.rating)}{'☆'.repeat(5-c.rating)}</span>
                      <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>{c.appliedDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default RecruitmentTab;