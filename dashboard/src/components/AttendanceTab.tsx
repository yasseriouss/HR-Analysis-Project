import React, { useState, useMemo, useEffect } from 'react';
import { db, computeSalary, seedDatabase, isDbSeeded } from '../data/db';
import type { AccessEmployee, Movement, MainPeriod } from '../types/access-db';
import { t, formatCurrency } from '../utils/i18n';
import type { Language } from '../utils/i18n';
import { usePagination, PaginationBar } from '../utils/usePagination';
import { Clock, FileSpreadsheet, RefreshCw } from 'lucide-react';

interface AttendanceTabProps {
  lang: Language;
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({ lang }) => {
  const isRtl = lang === 'ar';

  // Data state
  const [employees, setEmployees] = useState<AccessEmployee[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [periods, setPeriods] = useState<MainPeriod[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Load data from IndexedDB
  const loadData = async () => {
    setLoading(true);
    try {
      const seeded = await isDbSeeded();
      if (!seeded) {
        await seedDatabase();
      }
      const [emps, movs, pers] = await Promise.all([
        db.employees.toArray(),
        db.movements.toArray(),
        db.mainPeriods.toArray(),
      ]);
      setEmployees(emps);
      setMovements(movs);
      setPeriods(pers);
      if (pers.length > 0 && !selectedPeriod) {
        setSelectedPeriod(pers[pers.length - 1].dateNo);
      }
    } catch (e) {
      console.error('Failed to load attendance data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter movements by selected period + join with employees
  const payrollData = useMemo(() => {
    if (!selectedPeriod) return [];
    const periodMovements = movements.filter(m => m.dateNo === selectedPeriod);
    return periodMovements.map(mov => {
      const emp = employees.find(e => e.jobNumber === mov.employeeNo);
      if (!emp) return null;
      const salary = computeSalary(emp, mov);
      return { employee: emp, movement: mov, ...salary };
    }).filter(Boolean) as (ReturnType<typeof computeSalary> & { employee: AccessEmployee; movement: Movement })[];
  }, [selectedPeriod, movements, employees]);

  // Summary statistics
  const summary = useMemo(() => {
    if (payrollData.length === 0) return { totalNet: 0, totalAllowances: 0, totalDeductions: 0, headcount: 0 };
    return {
      totalNet: payrollData.reduce((a, b) => a + b.netPay, 0),
      totalAllowances: payrollData.reduce((a, b) => a + b.allowancesTotal, 0),
      totalDeductions: payrollData.reduce((a, b) => a + b.deductionsTotal, 0),
      headcount: payrollData.length,
    };
  }, [payrollData]);

  // Pagination
  const pagination = usePagination(payrollData, 10);

  // Export to CSV
  const handleExport = () => {
    const labelEmp = t('attendanceEmployee', lang);
    const labelWage = t('attendanceDailyWage', lang);
    const labelDays = t('attendanceDays', lang);
    const labelOT = t('attendanceOvertime', lang);
    const labelAllow = t('attendanceAllowances', lang);
    const labelDed = t('attendanceDeductions', lang);
    const labelNet = t('attendanceNet', lang);

    const rows = payrollData.map(p => ({
      [labelEmp]: p.employee.fullName || '',
      [labelWage]: p.employee.dailyWage || 0,
      [labelDays]: p.movement.days || 0,
      [labelOT]: p.movement.addHours || 0,
      [labelAllow]: p.allowancesTotal,
      [labelDed]: p.deductionsTotal,
      [labelNet]: p.netPay,
    }));
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(','),
      ...rows.map(r => headers.map(h => `"${r[h]}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll_${selectedPeriod}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="glass-panel-noclick" style={{ padding: '40px', textAlign: 'center' }}>
        <RefreshCw size={32} className="glowing-element" style={{ color: 'var(--accent-cyan)' }} />
        <p style={{ marginTop: '16px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
          {t('commonRefresh', lang)}...
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="glass-panel-noclick" style={{ padding: '20px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: 'var(--accent-cyan)' }}><Clock size={24} /></div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
              {t('attendanceTitle', lang)} — {selectedPeriod}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
              {summary.headcount} {t('attendanceEmployees', lang)} · {t('attendanceNetPayroll', lang)}: {formatCurrency(summary.totalNet, lang)}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input-select"
            style={{ fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}
          >
            {periods.map(p => (
              <option key={p.dateNo} value={p.dateNo}>{p.dateNo}</option>
            ))}
          </select>
          <button onClick={handleExport} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <FileSpreadsheet size={16} />
            {t('attendanceExport', lang)}
          </button>
          <button onClick={loadData} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="metrics-row">
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{t('attendanceTotalNet', lang)}</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-stayed)', fontFamily: 'var(--font-family)' }}>
            {formatCurrency(summary.totalNet, lang)}
          </div>
        </div>
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{t('attendanceTotalAllowances', lang)}</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-family)' }}>
            {formatCurrency(summary.totalAllowances, lang)}
          </div>
        </div>
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{t('attendanceTotalDeductions', lang)}</span>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-left)', fontFamily: 'var(--font-family)' }}>
            {formatCurrency(summary.totalDeductions, lang)}
          </div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="glass-panel-noclick" style={{ padding: '24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: isRtl ? 'right' : 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '10px 12px' }}>{t('attendanceEmployee', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('attendanceDailyWage', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('attendanceDays', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('attendanceOvertime', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('attendanceContSal', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('attendanceAllowances', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('attendanceDeductions', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('attendanceNet', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {pagination.pageData.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-dim)' }}>
                  {t('commonNoData', lang)}
                </td>
              </tr>
            )}
            {pagination.pageData.map((p, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>
                  <div>{p.employee.fullName || `#${p.employee.jobNumber}`}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>#{p.employee.jobNumber}</div>
                </td>
                <td style={{ padding: '10px 12px' }}>{formatCurrency(p.employee.dailyWage || 0, lang)}</td>
                <td style={{ padding: '10px 12px' }}>{p.movement.days || 0}</td>
                <td style={{ padding: '10px 12px' }}>{(p.movement.addHours || 0).toFixed(1)}</td>
                <td style={{ padding: '10px 12px' }}>{formatCurrency(p.contSalary, lang)}</td>
                <td style={{ padding: '10px 12px', color: 'var(--color-stayed)' }}>{formatCurrency(p.allowancesTotal, lang)}</td>
                <td style={{ padding: '10px 12px', color: 'var(--color-left)' }}>{formatCurrency(p.deductionsTotal, lang)}</td>
                <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--accent-cyan)' }}>{formatCurrency(p.netPay, lang)}</td>
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
          totalItems={payrollData.length}
        />
      </div>
    </div>
  );
};
export default AttendanceTab;