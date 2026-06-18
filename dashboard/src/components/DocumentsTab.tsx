import React, { useMemo, useState } from 'react';
import { StatCard } from './StatCard';
import { FileText, Download, Clock, CheckCircle, Calendar } from 'lucide-react';
import type { Language } from '../utils/i18n';

interface Document { id: string; name: string; type: string; employee?: string; department: string; uploadDate: string; expiryDate?: string; size: string; status: 'valid' | 'expiring' | 'expired'; }

function generateDocs(lang: string): Document[] {
  const isAr = lang === 'ar';
  return [
    { id: 'd1', name: isAr ? 'عقد توظيف - أحمد حسن' : 'Employment Contract - Ahmed H.', type: isAr ? 'عقد' : 'Contract', employee: 'Ahmed Hassan', department: 'IT', uploadDate: '2024-03-15', expiryDate: '2027-03-15', size: '245 KB', status: 'valid' },
    { id: 'd2', name: isAr ? 'شهادة تأمين صحي 2026' : 'Health Insurance Cert 2026', type: isAr ? 'تأمين' : 'Insurance', department: 'All', uploadDate: '2026-01-05', expiryDate: '2026-12-31', size: '1.2 MB', status: 'valid' },
    { id: 'd3', name: isAr ? 'رخصة قيادة - سيارة 5234' : 'Driving License - Car 5234', type: isAr ? 'رخصة' : 'License', department: 'Fleet', uploadDate: '2025-08-20', expiryDate: '2026-08-20', size: '890 KB', status: 'expiring' },
    { id: 'd4', name: isAr ? 'تقييم أداء - الربع الثاني' : 'Performance Review - Q2', type: isAr ? 'تقييم' : 'Review', employee: 'Sarah Ibrahim', department: 'Sales', uploadDate: '2026-04-10', size: '156 KB', status: 'valid' },
    { id: 'd5', name: isAr ? 'سياسة العمل عن بعد' : 'Remote Work Policy', type: isAr ? 'سياسة' : 'Policy', department: 'All', uploadDate: '2026-02-01', size: '320 KB', status: 'valid' },
    { id: 'd6', name: isAr ? 'شهادة تدريب - محمد علي' : 'Training Cert - Mohamed A.', type: isAr ? 'شهادة' : 'Certificate', employee: 'Mohamed Ali', department: 'IT', uploadDate: '2026-03-22', size: '500 KB', status: 'valid' },
    { id: 'd7', name: isAr ? 'تأمين مركبة - منتهي' : 'Vehicle Insurance - Expired', type: isAr ? 'تأمين' : 'Insurance', department: 'Fleet', uploadDate: '2025-05-10', expiryDate: '2026-05-10', size: '750 KB', status: 'expired' },
    { id: 'd8', name: isAr ? 'نموذج طلب إجازة' : 'Leave Request Template', type: isAr ? 'نموذج' : 'Template', department: 'HR', uploadDate: '2025-01-01', size: '80 KB', status: 'valid' },
  ];
}

const STATUS_COLORS = { valid: '#10B981', expiring: '#F59E0B', expired: '#EF4444' };
const STATUS_LABELS: Record<string, { en: string; ar: string }> = {
  valid: { en: 'Valid', ar: 'ساري' },
  expiring: { en: 'Expiring Soon', ar: 'قريب الانتهاء' },
  expired: { en: 'Expired', ar: 'منتهي' },
};

export const DocumentsTab: React.FC<{ lang: Language }> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const [filter, setFilter] = useState<string>('all');
  const docs = useMemo(() => generateDocs(lang), [lang]);
  const filtered = useMemo(() => filter === 'all' ? docs : docs.filter(d => d.status === filter), [docs, filter]);

  const summary = useMemo(() => ({
    total: docs.length, expiring: docs.filter(d => d.status === 'expiring').length,
    expired: docs.filter(d => d.status === 'expired').length, valid: docs.filter(d => d.status === 'valid').length,
  }), [docs]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
        <StatCard id="doc-total" title={isRtl ? 'إجمالي المستندات' : 'Total Documents'} value={summary.total} icon={<FileText size={16} />} />
        <StatCard id="doc-valid" title={isRtl ? 'سارية' : 'Valid'} value={summary.valid} icon={<CheckCircle size={16} />} colorClass="text-emerald-400" />
        <StatCard id="doc-expiring" title={isRtl ? 'قريب الانتهاء' : 'Expiring Soon'} value={summary.expiring} icon={<Clock size={16} />} colorClass="text-amber-400" glowing={summary.expiring > 0} />
        <StatCard id="doc-expired" title={isRtl ? 'منتهية' : 'Expired'} value={summary.expired} icon={<Clock size={16} />} colorClass="text-red-400" glowing={summary.expired > 0} />
      </div>

      <div className="glass-panel-noclick" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{isRtl ? 'مستودع المستندات' : 'Document Repository'}</h3>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['all', 'valid', 'expiring', 'expired'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '4px 10px', borderRadius: '6px', border: filter === f ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)', background: filter === f ? 'rgba(6,182,212,0.1)' : 'var(--bg-card)', color: filter === f ? 'var(--accent-cyan)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
                {f === 'all' ? (isRtl ? 'الكل' : 'All') : STATUS_LABELS[f][lang]}
              </button>
            ))}
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead><tr style={{ borderBottom: '2px solid var(--border-color)' }}>
            {[isRtl ? 'المستند' : 'Document', isRtl ? 'النوع' : 'Type', isRtl ? 'القسم' : 'Dept', isRtl ? 'تاريخ الرفع' : 'Uploaded', isRtl ? 'الانتهاء' : 'Expiry', isRtl ? 'الحجم' : 'Size', isRtl ? 'الحالة' : 'Status', ''].map((h, i) => (
              <th key={i} style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
            ))}</tr></thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-main)' }}>
                  <FileText size={12} style={{ marginRight: '4px', color: 'var(--text-dim)' }} />{d.name}
                </td>
                <td style={{ padding: '8px 10px', color: 'var(--text-muted)', fontSize: '11px' }}>{d.type}</td>
                <td style={{ padding: '8px 10px', color: 'var(--text-muted)' }}>{d.department}</td>
                <td style={{ padding: '8px 10px', color: 'var(--text-dim)', fontSize: '11px' }}><Calendar size={10} style={{ verticalAlign: 'middle' }} /> {d.uploadDate}</td>
                <td style={{ padding: '8px 10px', color: d.status === 'expired' ? '#EF4444' : d.status === 'expiring' ? '#F59E0B' : 'var(--text-dim)', fontSize: '11px' }}>
                  {d.expiryDate || '-'}
                  {d.status === 'expired' && <span style={{ margin: '4px', fontSize: '10px', padding: '1px 4px', borderRadius: '4px', background: 'rgba(239,68,68,0.12)', color: '#EF4444' }}>{isRtl ? 'منتهي' : 'EXPIRED'}</span>}
                </td>
                <td style={{ padding: '8px 10px', color: 'var(--text-dim)' }}>{d.size}</td>
                <td style={{ padding: '8px 10px' }}>
                  <span style={{ padding: '2px 6px', borderRadius: '8px', fontSize: '10px', fontWeight: 600, background: STATUS_COLORS[d.status] + '15', color: STATUS_COLORS[d.status] }}>
                    {STATUS_LABELS[d.status][lang]}
                  </span>
                </td>
                <td style={{ padding: '8px 10px' }}>
                  <button style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', cursor: 'pointer', fontSize: '10px' }}>
                    <Download size={10} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default DocumentsTab;