import React, { useMemo, useState } from 'react';
import { StatCard } from './StatCard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Clock, Users, Calendar, MapPin, QrCode, Fingerprint, TrendingUp } from 'lucide-react';
import type { Language } from '../utils/i18n';

interface ShiftRecord {
  id: string;
  employeeName: string;
  department: string;
  shiftType: 'morning' | 'evening' | 'night' | 'flexible';
  clockIn: string;
  clockOut: string;
  method: 'gps' | 'qr' | 'biometric' | 'manual';
  status: 'on-time' | 'late' | 'absent' | 'overtime';
  location?: string;
  hoursWorked: number;
  overtimeHours: number;
  date: string;
}

const SHIFT_TYPE_LABELS: Record<string, { en: string; ar: string; color: string }> = {
  morning: { en: 'Morning (6AM-2PM)', ar: 'صباحي (6ص-2م)', color: '#F59E0B' },
  evening: { en: 'Evening (2PM-10PM)', ar: 'مسائي (2م-10م)', color: '#8B5CF6' },
  night: { en: 'Night (10PM-6AM)', ar: 'ليلي (10م-6ص)', color: '#6366F1' },
  flexible: { en: 'Flexible', ar: 'مرن', color: '#10B981' },
};

const METHOD_ICONS: Record<string, React.ReactNode> = {
  gps: <MapPin size={12} />,
  qr: <QrCode size={12} />,
  biometric: <Fingerprint size={12} />,
  manual: <Clock size={12} />,
};

function generateShifts(): ShiftRecord[] {
  const names = ['Ahmed Hassan', 'Sarah Ibrahim', 'Mohamed Ali', 'Nour Ahmed', 'Layla Mahmoud', 'Omar Khalid',
    'Fatima Nasser', 'Hassan Youssef', 'Aisha Tarek', 'Youssef Samir'];
  const depts = ['Operations', 'Sales', 'IT', 'Manufacturing', 'Logistics'];
  const shiftTypes: Array<'morning' | 'evening' | 'night' | 'flexible'> = ['morning', 'evening', 'night', 'flexible'];
  const methods: Array<'gps' | 'qr' | 'biometric' | 'manual'> = ['gps', 'qr', 'biometric', 'manual'];
  const statuses: Array<'on-time' | 'late' | 'absent' | 'overtime'> = ['on-time', 'on-time', 'on-time', 'late', 'overtime', 'absent'];

  const shifts: ShiftRecord[] = [];
  for (let day = 1; day <= 7; day++) {
    names.forEach((name, i) => {
      const shiftType = shiftTypes[i % 4];
      const baseHours = shiftType === 'night' ? 8 : 8;
      const status = statuses[(i + day) % statuses.length];
      const overtimeHours = status === 'overtime' ? Math.floor(Math.random() * 3) + 1 : 0;

      shifts.push({
        id: `SHIFT-${day}-${i}`,
        employeeName: name,
        department: depts[i % depts.length],
        shiftType,
        clockIn: `${6 + (shiftType === 'evening' ? 8 : shiftType === 'night' ? 16 : 0).toString().padStart(2, '0')}:${String((i * 5) % 60).padStart(2, '0')}`,
        clockOut: `${14 + (shiftType === 'evening' ? 8 : shiftType === 'night' ? 16 : 0).toString().padStart(2, '0')}:${String((i * 7 + 30) % 60).padStart(2, '0')}`,
        method: methods[i % 4],
        status,
        location: status !== 'absent' ? 'Main Office - Floor ' + (1 + (i % 3)) : undefined,
        hoursWorked: status === 'absent' ? 0 : baseHours,
        overtimeHours,
        date: `2026-06-${String(day).padStart(2, '0')}`,
      });
    });
  }
  return shifts;
}

const PIE_COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const ShiftManagement: React.FC<{ lang: Language }> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const [selectedDay, setSelectedDay] = useState('all');

  const allShifts = useMemo(() => generateShifts(), []);
  const shifts = useMemo(() =>
    selectedDay === 'all' ? allShifts : allShifts.filter(s => s.date === selectedDay),
    [allShifts, selectedDay]
  );

  const summary = useMemo(() => {
    const total = shifts.length;
    const onTime = shifts.filter(s => s.status === 'on-time').length;
    const late = shifts.filter(s => s.status === 'late').length;
    const absent = shifts.filter(s => s.status === 'absent').length;
    const overtime = shifts.filter(s => s.status === 'overtime').length;
    const totalOvertime = shifts.reduce((s, sh) => s + sh.overtimeHours, 0);
    return { total, onTime, late, absent, overtime, totalOvertime };
  }, [shifts]);

  const statusPieData = [
    { name: isRtl ? 'في الوقت' : 'On-Time', value: summary.onTime },
    { name: isRtl ? 'متأخر' : 'Late', value: summary.late },
    { name: isRtl ? 'غائب' : 'Absent', value: summary.absent },
    { name: isRtl ? 'إضافي' : 'Overtime', value: summary.overtime },
  ].filter(s => s.value > 0);

  const methodData = useMemo(() => {
    const map: Record<string, number> = {};
    shifts.forEach(s => { map[s.method] = (map[s.method] || 0) + 1; });
    return Object.entries(map).map(([m, v]) => ({ name: m.toUpperCase(), value: v }));
  }, [shifts]);

  const shiftTypeData = useMemo(() => {
    const map: Record<string, { count: number; onTime: number; late: number }> = {};
    shifts.forEach(s => {
      const label = SHIFT_TYPE_LABELS[s.shiftType][lang];
      if (!map[label]) map[label] = { count: 0, onTime: 0, late: 0 };
      map[label].count++;
      if (s.status === 'on-time') map[label].onTime++;
      if (s.status === 'late') map[label].late++;
    });
    return Object.entries(map).map(([name, vals]) => ({ name, onTime: vals.onTime, late: vals.late, total: vals.count }));
  }, [shifts, lang]);

  const days = ['2026-06-01', '2026-06-02', '2026-06-03', '2026-06-04', '2026-06-05', '2026-06-06', '2026-06-07'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Day Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={() => setSelectedDay('all')} style={{
          padding: '6px 14px', borderRadius: '20px', border: selectedDay === 'all' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
          background: selectedDay === 'all' ? 'rgba(6, 182, 212, 0.1)' : 'var(--bg-card)', color: selectedDay === 'all' ? 'var(--accent-cyan)' : 'var(--text-muted)',
          cursor: 'pointer', fontSize: '12px', fontWeight: 600
        }}>{isRtl ? 'الكل' : 'All Days'}</button>
        {days.map(d => (
          <button key={d} onClick={() => setSelectedDay(d)} style={{
            padding: '6px 14px', borderRadius: '20px', border: selectedDay === d ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
            background: selectedDay === d ? 'rgba(6, 182, 212, 0.1)' : 'var(--bg-card)', color: selectedDay === d ? 'var(--accent-cyan)' : 'var(--text-muted)',
            cursor: 'pointer', fontSize: '12px', fontWeight: 600
          }}>{new Date(d).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { weekday: 'short' })}</button>
        ))}
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
        <StatCard id="shift-total" title={isRtl ? 'إجمالي النوبات' : 'Total Shifts'} value={summary.total} icon={<Clock size={18} />} />
        <StatCard id="shift-ontime" title={isRtl ? 'في الوقت' : 'On-Time'} value={`${summary.onTime} (${((summary.onTime/summary.total)*100).toFixed(0)}%)`} icon={<Users size={18} />} colorClass="text-emerald-400" />
        <StatCard id="shift-late" title={isRtl ? 'متأخر' : 'Late'} value={summary.late} icon={<TrendingUp size={18} />} colorClass="text-amber-400" glowing={summary.late > 0} />
        <StatCard id="shift-absent" title={isRtl ? 'غائب' : 'Absent'} value={summary.absent} icon={<Calendar size={18} />} colorClass="text-red-400" glowing={summary.absent > 0} />
        <StatCard id="shift-overtime" title={isRtl ? 'ساعات إضافية' : 'Overtime'} value={`${summary.totalOvertime}h`} icon={<Clock size={18} />} colorClass="gradient-text" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        {/* Attendance Status Pie */}
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
            {isRtl ? 'حالة الحضور' : 'Attendance Status'}
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label>
                {statusPieData.map((_, i) => (<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Shift Type Distribution */}
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
            {isRtl ? 'توزيع أنواع النوبات' : 'Shift Type Distribution'}
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={shiftTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px' }} />
              <Legend />
              <Bar dataKey="onTime" name={isRtl ? 'في الوقت' : 'On-Time'} fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="late" name={isRtl ? 'متأخر' : 'Late'} fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Check-in Method */}
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
            {isRtl ? 'وسيلة تسجيل الحضور' : 'Check-In Method'}
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={methodData.map(m => ({ ...m, fullMark: shifts.length / 2 }))}>
              <PolarGrid stroke="var(--border-color)" />
              <PolarAngleAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fill: 'var(--text-dim)', fontSize: 10 }} />
              <Radar dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Today's Shifts Table */}
      <div className="glass-panel-noclick" style={{ padding: '16px', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
          {isRtl ? 'نوبات اليوم' : "Today's Shifts"}
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              {[isRtl ? 'الموظف' : 'Employee', isRtl ? 'القسم' : 'Dept', isRtl ? 'النوبة' : 'Shift',
                isRtl ? 'الدخول' : 'In', isRtl ? 'الخروج' : 'Out', isRtl ? 'الوسيلة' : 'Method',
                isRtl ? 'الموقع' : 'Location', isRtl ? 'الحالة' : 'Status', isRtl ? 'إضافي' : 'OT'
              ].map((h, i) => (
                <th key={i} style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shifts.filter(s => s.date === '2026-06-07').slice(0, 10).map((s, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-main)' }}>{s.employeeName}</td>
                <td style={{ padding: '8px 10px', color: 'var(--text-muted)' }}>{s.department}</td>
                <td style={{ padding: '8px 10px' }}>
                  <span style={{ padding: '2px 6px', borderRadius: '10px', fontSize: '11px', background: SHIFT_TYPE_LABELS[s.shiftType].color + '20', color: SHIFT_TYPE_LABELS[s.shiftType].color }}>
                    {SHIFT_TYPE_LABELS[s.shiftType][lang]}
                  </span>
                </td>
                <td style={{ padding: '8px 10px', color: 'var(--text-muted)' }}>{s.clockIn}</td>
                <td style={{ padding: '8px 10px', color: 'var(--text-muted)' }}>{s.clockOut}</td>
                <td style={{ padding: '8px 10px' }}>{METHOD_ICONS[s.method]} <span style={{ fontSize: '10px', color: 'var(--text-dim)', marginLeft: '4px' }}>{s.method.toUpperCase()}</span></td>
                <td style={{ padding: '8px 10px', color: 'var(--text-dim)', fontSize: '11px' }}>{s.location || '-'}</td>
                <td style={{ padding: '8px 10px' }}>
                  <span style={{
                    padding: '2px 6px', borderRadius: '10px', fontSize: '10px', fontWeight: 600,
                    background: s.status === 'on-time' ? 'rgba(16,185,129,0.12)' : s.status === 'late' ? 'rgba(245,158,11,0.12)' : s.status === 'absent' ? 'rgba(239,68,68,0.12)' : 'rgba(139,92,246,0.12)',
                    color: s.status === 'on-time' ? '#10B981' : s.status === 'late' ? '#F59E0B' : s.status === 'absent' ? '#EF4444' : '#8B5CF6'
                  }}>{s.status.toUpperCase()}</span>
                </td>
                <td style={{ padding: '8px 10px', color: s.overtimeHours > 0 ? '#8B5CF6' : 'var(--text-dim)', fontWeight: s.overtimeHours > 0 ? 700 : 400 }}>
                  {s.overtimeHours > 0 ? `+${s.overtimeHours}h` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShiftManagement;