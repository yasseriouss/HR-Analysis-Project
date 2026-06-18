import React, { useState, useMemo } from 'react';
import { formatCurrency } from '../utils/payrollEngine';
import { Calculator, Clock } from 'lucide-react';
import type { Language } from '../utils/i18n';

interface HRToolsTabProps { lang: Language; }

export const HRToolsTab: React.FC<HRToolsTabProps> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const [salaryInput, setSalaryInput] = useState(10000);
  const [yearsInput, setYearsInput] = useState(5);
  const [includeMartyrsTax, setIncludeMartyrsTax] = useState(true);

  const taxCalc = useMemo(() => {
    const annual = salaryInput * 12;
    const exempt = 20000;
    const taxable = Math.max(0, annual - exempt);
    const brackets = [{ m: 0, M: 40000, r: 0 }, { m: 40000, M: 55000, r: 0.10 }, { m: 55000, M: 70000, r: 0.15 },
      { m: 70000, M: 200000, r: 0.20 }, { m: 200000, M: 400000, r: 0.225 }, { m: 400000, M: 600000, r: 0.25 },
      { m: 600000, M: 700000, r: 0.275 }, { m: 700000, M: Infinity, r: 0.275 }];
    let remaining = taxable, totalTax = 0;
    brackets.forEach(b => { if (remaining > 0) { const w = b.M - b.m; totalTax += Math.min(remaining, w) * b.r; remaining -= w; } });
    const monthlyTax = Math.round(totalTax / 12);
    const si = Math.round(Math.min(Math.max(salaryInput * 0.8, 7000), 12600) * 0.11);
    const martyrs = includeMartyrsTax && annual > 1000000 ? Math.round((annual * 0.01) / 12) : 0;
    const net = salaryInput - monthlyTax - si - martyrs;
    return { monthlyTax, si, martyrs, net, grossToNet: ((net / salaryInput) * 100).toFixed(1), annualTax: totalTax };
  }, [salaryInput, includeMartyrsTax]);

  const gratuityCalc = useMemo(() => {
    const salary = salaryInput;
    let gratuity: number;
    if (yearsInput < 1) gratuity = 0;
    else if (yearsInput <= 5) gratuity = yearsInput * 2 * salary;
    else gratuity = 5 * 2 * salary + (yearsInput - 5) * 3 * salary;
    return Math.min(gratuity, 24 * salary);
  }, [salaryInput, yearsInput]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {/* Tax Calculator */}
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
            <Calculator size={16} style={{ marginRight: '6px', color: 'var(--accent-cyan)' }} />
            {isRtl ? 'حاسبة الراتب والضرائب' : 'Salary & Tax Calculator'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                {isRtl ? 'الراتب الشهري (ج.م)' : 'Monthly Salary (EGP)'}
              </label>
              <input type="number" value={salaryInput} onChange={e => setSalaryInput(Number(e.target.value))} style={{
                width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)',
                background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '14px', fontWeight: 600
              }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={includeMartyrsTax} onChange={e => setIncludeMartyrsTax(e.target.checked)} id="martyrs" />
              <label htmlFor="martyrs" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {isRtl ? 'تضمين ضريبة الشهداء' : 'Include Martyrs Tax'}
              </label>
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderRadius: '6px', background: 'var(--bg-card)' }}>
              <span style={{ color: 'var(--text-muted)' }}>{isRtl ? 'ضريبة الدخل' : 'Income Tax'}</span>
              <span style={{ color: '#EF4444', fontWeight: 600 }}>-{formatCurrency(taxCalc.monthlyTax, lang)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderRadius: '6px', background: 'var(--bg-card)' }}>
              <span style={{ color: 'var(--text-muted)' }}>{isRtl ? 'التأمين الاجتماعي' : 'Social Insurance'}</span>
              <span style={{ color: '#F59E0B', fontWeight: 600 }}>-{formatCurrency(taxCalc.si, lang)}</span>
            </div>
            {taxCalc.martyrs > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderRadius: '6px', background: 'var(--bg-card)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{isRtl ? 'ضريبة الشهداء' : 'Martyrs Tax'}</span>
                <span style={{ color: '#6366F1', fontWeight: 600 }}>-{formatCurrency(taxCalc.martyrs, lang)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{isRtl ? 'صافي الراتب' : 'Net Salary'}</span>
              <span style={{ color: '#10B981', fontWeight: 800, fontSize: '16px' }}>{formatCurrency(taxCalc.net, lang)}</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', textAlign: 'center' }}>
              {isRtl ? `نسبة الصافي: ${taxCalc.grossToNet}%` : `Net-to-Gross: ${taxCalc.grossToNet}%`}
            </div>
          </div>
        </div>

        {/* Gratuity Calculator */}
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
            <Clock size={16} style={{ marginRight: '6px', color: 'var(--accent-cyan)' }} />
            {isRtl ? 'حاسبة مكافأة نهاية الخدمة' : 'EOSB / Gratuity Calculator'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                {isRtl ? 'الراتب الشهري (ج.م)' : 'Monthly Salary (EGP)'}
              </label>
              <input type="number" value={salaryInput} onChange={e => setSalaryInput(Number(e.target.value))} style={{
                width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)',
                background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '14px', fontWeight: 600
              }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                {isRtl ? 'سنوات الخدمة' : 'Years of Service'}
              </label>
              <input type="number" value={yearsInput} onChange={e => setYearsInput(Number(e.target.value))} min={0} max={40} style={{
                width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)',
                background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '14px', fontWeight: 600
              }} />
            </div>
            <div style={{ marginTop: '8px', padding: '16px', borderRadius: '10px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                {isRtl ? 'مكافأة نهاية الخدمة التقديرية' : 'Estimated EOSB'}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#F59E0B' }}>{formatCurrency(gratuityCalc, lang)}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
                {yearsInput < 1 ? (isRtl ? 'أقل من سنة - غير مستحق' : 'Less than 1 year - Not eligible') :
                 yearsInput <= 5 ? (isRtl ? 'شهرين عن كل سنة' : '2 months per year') :
                 (isRtl ? '3 أشهر بعد 5 سنوات' : '3 months after 5 years')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HRToolsTab;