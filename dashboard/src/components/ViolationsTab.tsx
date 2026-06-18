import { useState, useEffect } from 'react';
import { db, seedDatabase, isDbSeeded } from '../data/db';
import type { Violation, Vehicle } from '../types/access-db';
import { t, formatCurrency } from '../utils/i18n';
import type { Language } from '../utils/i18n';
import { usePagination, PaginationBar } from '../utils/usePagination';
import { ShieldAlert, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

interface ViolationsTabProps { lang: Language }

export const ViolationsTab: React.FC<ViolationsTabProps> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const [violations, setViolations] = useState<(Violation & { vehicle?: Vehicle })[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      if (!(await isDbSeeded())) await seedDatabase();
      const [viols, vehs] = await Promise.all([db.violations.toArray(), db.vehicles.toArray()]);
      setViolations(viols.map(v => ({ ...v, vehicle: vehs.find(ve => ve.plateNumber === v.plateNumber) })));
    } finally { setLoading(false); }
  };
  useEffect(() => { loadData(); }, []);

  const totalFines = violations.reduce((a, b) => a + (b.fineAmount || 0), 0);
  const totalPaid = violations.filter(v => v.paymentStatus).reduce((a, b) => a + (b.fineAmount || 0), 0);
  const totalUnpaid = violations.filter(v => !v.paymentStatus).reduce((a, b) => a + (b.fineAmount || 0), 0);

  const pagination = usePagination(violations, 10);

  if (loading) return (
    <div className="glass-panel-noclick" style={{ padding: '40px', textAlign: 'center' }}>
      <RefreshCw size={32} className="glowing-element" style={{ color: 'var(--accent-cyan)' }} />
      <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>{t('commonRefresh', lang)}...</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-panel-noclick" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ShieldAlert size={24} style={{ color: 'var(--accent-cyan)' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 700, fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>{t('violTitle', lang)}</h2>
      </div>

      <div className="metrics-row">
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{t('violTotalFines', lang)}</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-warning)', fontFamily: 'var(--font-family)' }}>{formatCurrency(totalFines, lang)}</div>
        </div>
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{t('violTotalPaid', lang)}</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-stayed)', fontFamily: 'var(--font-family)' }}>{formatCurrency(totalPaid, lang)}</div>
        </div>
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{t('violTotalUnpaid', lang)}</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-left)', fontFamily: 'var(--font-family)' }}>{formatCurrency(totalUnpaid, lang)}</div>
        </div>
      </div>

      <div className="glass-panel-noclick" style={{ padding: '24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: isRtl ? 'right' : 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '10px 12px' }}>{t('violCustomer', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('violPlate', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('violFine', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('violDate', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('violPlace', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('violStatus', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {pagination.pageData.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-dim)' }}>{t('commonNoData', lang)}</td></tr>
            )}
            {pagination.pageData.map((v, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{v.customerName || '-'}</td>
                <td style={{ padding: '10px 12px' }}>{v.plateNumber || '-'}</td>
                <td style={{ padding: '10px 12px', fontWeight: 700 }}>{formatCurrency(v.fineAmount || 0, lang)}</td>
                <td style={{ padding: '10px 12px' }}>{v.violationDate?.toLocaleDateString() || '-'}</td>
                <td style={{ padding: '10px 12px' }}>{v.violationPlace || '-'}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: v.paymentStatus ? 'var(--color-stayed)' : 'var(--color-left)' }}>
                    {v.paymentStatus ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {t(v.paymentStatus ? 'violPaid' : 'violUnpaid', lang)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <PaginationBar
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          setPage={pagination.setPage}
          nextPage={pagination.nextPage}
          prevPage={pagination.prevPage}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          totalItems={violations.length}
        />
      </div>
    </div>
  );
};
export default ViolationsTab;