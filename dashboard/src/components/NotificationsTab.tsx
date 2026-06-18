import React, { useMemo, useState } from 'react';
import { StatCard } from './StatCard';
import { Bell, AlertTriangle, CheckCircle, Clock, Info } from 'lucide-react';
import type { Language } from '../utils/i18n';

interface Notification { id: string; type: 'alert' | 'reminder' | 'info' | 'success'; title: string; message: string; date: string; read: boolean; action?: string; }

function generateNotifications(lang: string): Notification[] {
  const isAr = lang === 'ar';
  return [
    { id: 'n1', type: 'alert', title: isAr ? 'انتهاء عقد' : 'Contract Expiring', message: isAr ? 'عقد أحمد حسن ينتهي في 30 يوليو 2026' : 'Ahmed Hassan\'s contract expires on July 30, 2026', date: '2026-06-15', read: false, action: isAr ? 'تجديد' : 'Renew' },
    { id: 'n2', type: 'reminder', title: isAr ? 'مراجعة أداء' : 'Performance Review', message: isAr ? 'موعد مراجعة الأداء ربع السنوية لقسم المبيعات' : 'Quarterly performance review due for Sales department', date: '2026-06-14', read: false, action: isAr ? 'جدولة' : 'Schedule' },
    { id: 'n3', type: 'alert', title: isAr ? 'رصيد إجازات منخفض' : 'Low Leave Balance', message: isAr ? '5 موظفين لديهم رصيد إجازات أقل من 3 أيام' : '5 employees have less than 3 days leave remaining', date: '2026-06-13', read: true },
    { id: 'n4', type: 'info', title: isAr ? 'موظفون جدد' : 'New Hires', message: isAr ? '3 موظفين جدد ينضمون الأسبوع القادم - قسم تقنية المعلومات' : '3 new hires joining next week - IT Department', date: '2026-06-12', read: true },
    { id: 'n5', type: 'success', title: isAr ? 'اكتمل كشف الرواتب' : 'Payroll Completed', message: isAr ? 'تم معالجة كشف رواتب شهر يونيو بنجاح' : 'June payroll has been processed successfully', date: '2026-06-10', read: true },
    { id: 'n6', type: 'reminder', title: isAr ? 'تجديد التأمين' : 'Insurance Renewal', message: isAr ? 'تجديد وثيقة التأمين الصحي للموظفين قبل 1 يوليو' : 'Health insurance policy renewal due before July 1', date: '2026-06-09', read: false, action: isAr ? 'مراجعة' : 'Review' },
    { id: 'n7', type: 'alert', title: isAr ? 'انتهاء رخصة' : 'License Expiring', message: isAr ? 'رخصة قيادة 3 مركبات تنتهي هذا الشهر' : '3 vehicle licenses expiring this month', date: '2026-06-08', read: true },
    { id: 'n8', type: 'info', title: isAr ? 'تحديث النظام' : 'System Update', message: isAr ? 'تحديث مجدول للنظام يوم السبت الساعة 2 صباحاً' : 'Scheduled system maintenance on Saturday at 2 AM', date: '2026-06-07', read: true },
  ];
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  alert: <AlertTriangle size={16} />, reminder: <Bell size={16} />, info: <Info size={16} />, success: <CheckCircle size={16} />,
};
const TYPE_COLORS: Record<string, string> = { alert: '#EF4444', reminder: '#F59E0B', info: '#06B6D4', success: '#10B981' };

export const NotificationsTab: React.FC<{ lang: Language }> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifs, setNotifs] = useState(() => generateNotifications(lang));

  const filtered = useMemo(() => filter === 'unread' ? notifs.filter(n => !n.read) : notifs, [notifs, filter]);
  const unreadCount = notifs.filter(n => !n.read).length;

  const markRead = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setFilter('all')} style={{ padding: '6px 14px', borderRadius: '8px', border: filter === 'all' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)', background: filter === 'all' ? 'rgba(6,182,212,0.1)' : 'var(--bg-card)', color: filter === 'all' ? 'var(--accent-cyan)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>{isRtl ? 'الكل' : 'All'} ({notifs.length})</button>
          <button onClick={() => setFilter('unread')} style={{ padding: '6px 14px', borderRadius: '8px', border: filter === 'unread' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)', background: filter === 'unread' ? 'rgba(6,182,212,0.1)' : 'var(--bg-card)', color: filter === 'unread' ? 'var(--accent-cyan)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>{isRtl ? 'غير مقروء' : 'Unread'} ({unreadCount})</button>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', cursor: 'pointer', fontSize: '12px' }}>{isRtl ? 'تعليم الكل كمقروء' : 'Mark All Read'}</button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
        <StatCard id="notif-total" title={isRtl ? 'الإجمالي' : 'Total'} value={notifs.length} icon={<Bell size={16} />} />
        <StatCard id="notif-unread" title={isRtl ? 'غير مقروء' : 'Unread'} value={unreadCount} icon={<AlertTriangle size={16} />} colorClass="text-amber-400" glowing={unreadCount > 0} />
        <StatCard id="notif-alerts" title={isRtl ? 'تنبيهات' : 'Alerts'} value={notifs.filter(n => n.type === 'alert').length} icon={<AlertTriangle size={16} />} colorClass="text-red-400" />
        <StatCard id="notif-info" title={isRtl ? 'معلومات' : 'Info'} value={notifs.filter(n => n.type === 'info').length} icon={<Info size={16} />} />
      </div>

      <div className="glass-panel-noclick" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(n => (
            <div key={n.id} onClick={() => markRead(n.id)} style={{ padding: '14px', borderRadius: '10px', background: n.read ? 'transparent' : 'rgba(139,92,246,0.05)', border: `1px solid ${n.read ? 'var(--border-color)' : 'rgba(139,92,246,0.2)'}`, cursor: 'pointer', transition: 'all 0.15s ease', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: TYPE_COLORS[n.type] + '15', color: TYPE_COLORS[n.type], flexShrink: 0 }}>{TYPE_ICONS[n.type]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>{n.title}</div>
                  {!n.read && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8B5CF6' }} />}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{n.message}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}><Clock size={10} style={{ verticalAlign: 'middle' }} /> {n.date}</span>
                  {n.action && <button onClick={e => { e.stopPropagation(); }} style={{ padding: '3px 10px', borderRadius: '6px', border: 'none', background: 'rgba(139,92,246,0.12)', color: '#8B5CF6', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>{n.action}</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default NotificationsTab;