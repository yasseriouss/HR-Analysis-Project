import React, { useState, useMemo, useEffect } from 'react';
import { db, seedDatabase, isDbSeeded } from '../data/db';
import type { FinancialAdvance, Installment, AccessEmployee } from '../types/access-db';
import { t, formatCurrency } from '../utils/i18n';
import type { Language } from '../utils/i18n';
import { usePagination, PaginationBar } from '../utils/usePagination';
import { HandCoins, RefreshCw, CheckCircle2, Clock } from 'lucide-react';

interface AdvancesTabProps {
  lang: Language;
}

export const AdvancesTab: React.FC<AdvancesTabProps> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const [advances, setAdvances] = useState<(FinancialAdvance & { employee?: AccessEmployee })[]>([]);
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      if (!(await isDbSeeded())) await seedDatabase();
      const [advs, insts, emps] = await Promise.all([
        db.financialAdvances.toArray(),
        db.installments.toArray(),
        db.employees.toArray(),
      ]);
      setAdvances(advs.map(a => ({ ...a, employee: emps.find(e => e.jobNumber === a.employeeNo) })));
      setInstallments(insts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Summary stats
  const stats = useMemo(() => {
    const paid = installments.filter(i => i.paymentStatus === 'Paid').reduce((a, b) => a + (b.amount || 0), 0);
    const pending = installments.filter(i => i.paymentStatus === 'Pending').reduce((a, b) => a + (b.amount || 0), 0);
    const total = paid + pending;
    return { paid, pending, total, recoveryRate: total > 0 ? Math.round((paid / total) * 100) : 0 };
  }, [installments]);

  // Pagination
  const advancesPagination = usePagination(advances, 10);
  const installmentsPagination = usePagination(installments, 10);

  if (loading) {
    return (
      <div className="glass-panel-noclick" style={{ padding: '40px', textAlign: 'center' }}>
        <RefreshCw size={32} className="glowing-element" style={{ color: 'var(--accent-cyan)' }} />
        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>{t('commonRefresh', lang)}...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="glass-panel-noclick" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <HandCoins size={24} style={{ color: 'var(--accent-cyan)' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 700, fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>{t('advTitle', lang)}</h2>
      </div>

      {/* Summary */}
      <div className="metrics-row">
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{t('advPaidAmount', lang)}</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-stayed)', fontFamily: 'var(--font-family)' }}>{formatCurrency(stats.paid, lang)}</div>
        </div>
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{t('advPendingAmount', lang)}</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-left)', fontFamily: 'var(--font-family)' }}>{formatCurrency(stats.pending, lang)}</div>
        </div>
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{t('advRecoveryRate', lang)}</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-family)' }}>{stats.recoveryRate}%</div>
        </div>
      </div>

      {/* Advances Table */}
      <div className="glass-panel-noclick" style={{ padding: '24px', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
          {t('advFinancialAdvances', lang)}
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: isRtl ? 'right' : 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '10px 12px' }}>{t('advEmployee', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('advTotalPrice', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('advDownPayment', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('advNetPrice', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('advInstallmentValue', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('advInstallmentCount', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {advancesPagination.pageData.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-dim)' }}>{t('commonNoData', lang)}</td></tr>
            )}
            {advancesPagination.pageData.map((a, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{a.employee?.fullName || `#${a.employeeNo}`}</td>
                <td style={{ padding: '10px 12px' }}>{formatCurrency(a.totalPrice || 0, lang)}</td>
                <td style={{ padding: '10px 12px' }}>{formatCurrency(a.downPayment || 0, lang)}</td>
                <td style={{ padding: '10px 12px', fontWeight: 700 }}>{formatCurrency(a.netPrice || 0, lang)}</td>
                <td style={{ padding: '10px 12px' }}>{formatCurrency(a.installmentValue || 0, lang)}</td>
                <td style={{ padding: '10px 12px' }}>{a.installmentCount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <PaginationBar
          currentPage={advancesPagination.currentPage}
          totalPages={advancesPagination.totalPages}
          setPage={advancesPagination.setPage}
          nextPage={advancesPagination.nextPage}
          prevPage={advancesPagination.prevPage}
          hasNext={advancesPagination.hasNext}
          hasPrev={advancesPagination.hasPrev}
          startIndex={advancesPagination.startIndex}
          endIndex={advancesPagination.endIndex}
          totalItems={advances.length}
        />
      </div>

      {/* Installments Table */}
      <div className="glass-panel-noclick" style={{ padding: '24px', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
          {t('advInstallments', lang)}
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: isRtl ? 'right' : 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '10px 12px' }}>{t('advEmployee', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('advPaymentDate', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('advAmount', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('advStatus', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {installmentsPagination.pageData.length === 0 && (
              <tr><td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-dim)' }}>{t('commonNoData', lang)}</td></tr>
            )}
            {installmentsPagination.pageData.map((inst, idx) => {
              const emp = advances.find(a => a.employeeNo === inst.employeeNo);
              const isPaid = inst.paymentStatus === 'Paid';
              return (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{emp?.employee?.fullName || `#${inst.employeeNo}`}</td>
                  <td style={{ padding: '10px 12px' }}>{inst.paymentDate?.toLocaleDateString()}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{formatCurrency(inst.amount || 0, lang)}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isPaid ? 'var(--color-stayed)' : 'var(--color-warning)' }}>
                      {isPaid ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                      {t(isPaid ? 'advPaid' : 'advPending', lang)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <PaginationBar
          currentPage={installmentsPagination.currentPage}
          totalPages={installmentsPagination.totalPages}
          setPage={installmentsPagination.setPage}
          nextPage={installmentsPagination.nextPage}
          prevPage={installmentsPagination.prevPage}
          hasNext={installmentsPagination.hasNext}
          hasPrev={installmentsPagination.hasPrev}
          startIndex={installmentsPagination.startIndex}
          endIndex={installmentsPagination.endIndex}
          totalItems={installments.length}
        />
      </div>
    </div>
  );
};
export default AdvancesTab;