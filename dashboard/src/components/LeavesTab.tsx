import React, { useState, useEffect } from 'react';
import { db, seedDatabase, isDbSeeded } from '../data/db';
import type { LeaveRecord, LeaveType, AccessEmployee } from '../types/access-db';
import { t } from '../utils/i18n';
import type { Language } from '../utils/i18n';
import { usePagination, PaginationBar } from '../utils/usePagination';
import { CalendarCheck, RefreshCw } from 'lucide-react';

interface LeavesTabProps { lang: Language }

export const LeavesTab: React.FC<LeavesTabProps> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const [leaves, setLeaves] = useState<(LeaveRecord & { employee?: AccessEmployee })[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      if (!(await isDbSeeded())) await seedDatabase();
      const [lvs, lts, emps] = await Promise.all([
        db.leaveRecords.toArray(),
        db.leaveTypes.toArray(),
        db.employees.toArray(),
      ]);
      setLeaves(lvs.map(l => ({ ...l, employee: emps.find(e => e.jobNumber === l.employeeNo) })));
      setLeaveTypes(lts);
    } finally { setLoading(false); }
  };
  useEffect(() => { loadData(); }, []);

  const pagination = usePagination(leaves, 10);

  if (loading) return (
    <div className="glass-panel-noclick" style={{ padding: '40px', textAlign: 'center' }}>
      <RefreshCw size={32} className="glowing-element" style={{ color: 'var(--accent-cyan)' }} />
      <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>{t('commonRefresh', lang)}...</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-panel-noclick" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <CalendarCheck size={24} style={{ color: 'var(--accent-cyan)' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 700, fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>{t('leaveTitle', lang)}</h2>
      </div>

      {/* Leave types reference */}
      <div className="metrics-row">
        {leaveTypes.map((lt, idx) => (
          <div key={idx} className="glass-panel-noclick" style={{ padding: '20px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{lt.leaveType}</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-family)' }}>{lt.maxDays || 0} {t('unitDaysMax', lang)}</div>
          </div>
        ))}
      </div>

      {/* Leaves table */}
      <div className="glass-panel-noclick" style={{ padding: '24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: isRtl ? 'right' : 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '10px 12px' }}>{t('leaveEmployee', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('leaveType', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('leaveStart', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('leaveDays', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {pagination.pageData.length === 0 && (
              <tr><td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-dim)' }}>{t('commonNoData', lang)}</td></tr>
            )}
            {pagination.pageData.map((l, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{l.employee?.fullName || `#${l.employeeNo}`}</td>
                <td style={{ padding: '10px 12px' }}>{l.leaveType}</td>
                <td style={{ padding: '10px 12px' }}>{l.startDate?.toLocaleDateString()}</td>
                <td style={{ padding: '10px 12px' }}>{l.daysCount || 0}</td>
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
          totalItems={leaves.length}
        />
      </div>
    </div>
  );
};
export default LeavesTab;