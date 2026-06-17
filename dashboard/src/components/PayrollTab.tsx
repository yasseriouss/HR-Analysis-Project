import React, { useState, useMemo } from 'react';
import type { Employee } from '../types/employee';
import type { PayrollConfig } from '../types/payroll';
import { StatCard } from './StatCard';
import { generatePayrollBatch, calculatePayrollSummary, formatCurrency, DEFAULT_PAYROLL_CONFIG } from '../utils/payrollEngine';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  Wallet, Receipt, TrendingDown, Users, Calculator,
  ChevronDown, ChevronUp, Filter, CreditCard
} from 'lucide-react';
import type { Language } from '../utils/i18n';

interface PayrollTabProps {
  data: Employee[];
  lang: Language;
}

export const PayrollTab: React.FC<PayrollTabProps> = ({ data, lang }) => {
  const isRtl = lang === 'ar';
  const [selectedPeriod, setSelectedPeriod] = useState('2026-06');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [config] = useState<PayrollConfig>(DEFAULT_PAYROLL_CONFIG);

  // Generate payroll records
  const payrollRecords = useMemo(() => {
    return generatePayrollBatch(data, selectedPeriod, config);
  }, [data, selectedPeriod, config]);

  // Calculate summary
  const summary = useMemo(() => {
    return calculatePayrollSummary(payrollRecords);
  }, [payrollRecords]);

  // Department breakdown
  const departmentData = useMemo(() => {
    const deptMap: Record<string, { gross: number; net: number; tax: number; si: number; count: number }> = {};
    payrollRecords.forEach(rec => {
      if (!deptMap[rec.department]) {
        deptMap[rec.department] = { gross: 0, net: 0, tax: 0, si: 0, count: 0 };
      }
      deptMap[rec.department].gross += rec.grossSalary;
      deptMap[rec.department].net += rec.netSalary;
      deptMap[rec.department].tax += rec.incomeTax;
      deptMap[rec.department].si += rec.socialInsuranceEmployee;
      deptMap[rec.department].count++;
    });
    return Object.entries(deptMap).map(([dept, vals]) => ({
      name: dept,
      gross: Math.round(vals.gross / vals.count),
      net: Math.round(vals.net / vals.count),
      tax: Math.round(vals.tax / vals.count),
      si: Math.round(vals.si / vals.count),
      employees: vals.count,
    }));
  }, [payrollRecords]);

  // Deduction breakdown pie data
  const deductionPieData = useMemo(() => {
    const totals = payrollRecords.reduce(
      (acc, rec) => ({
        incomeTax: acc.incomeTax + rec.incomeTax,
        socialInsurance: acc.socialInsurance + rec.socialInsuranceEmployee,
        martyrsTax: acc.martyrsTax + rec.martyrsTax,
        insurance: acc.insurance + rec.insuranceDeduction,
      }),
      { incomeTax: 0, socialInsurance: 0, martyrsTax: 0, insurance: 0 }
    );

    return [
      { name: isRtl ? 'ضريبة الدخل' : 'Income Tax', value: totals.incomeTax, color: '#EF4444' },
      { name: isRtl ? 'التأمين الاجتماعي' : 'Social Insurance', value: totals.socialInsurance, color: '#F59E0B' },
      { name: isRtl ? 'ضريبة الشهداء' : 'Martyrs Tax', value: totals.martyrsTax, color: '#6366F1' },
      { name: isRtl ? 'تأمين صحي' : 'Health Insurance', value: totals.insurance, color: '#06B6D4' },
    ].filter(item => item.value > 0);
  }, [payrollRecords, isRtl]);

  // Net salary distribution
  const salaryDistribution = useMemo(() => {
    const ranges = [
      { label: '< 5K', min: 0, max: 5000, count: 0 },
      { label: '5K-10K', min: 5000, max: 10000, count: 0 },
      { label: '10K-15K', min: 10000, max: 15000, count: 0 },
      { label: '15K-20K', min: 15000, max: 20000, count: 0 },
      { label: '20K-30K', min: 20000, max: 30000, count: 0 },
      { label: '30K+', min: 30000, max: Infinity, count: 0 },
    ];
    payrollRecords.forEach(rec => {
      const range = ranges.find(r => rec.netSalary >= r.min && rec.netSalary < r.max);
      if (range) range.count++;
    });
    return ranges;
  }, [payrollRecords]);

  // Generate period options
  const periods = useMemo(() => {
    const p: string[] = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(2026, i, 1);
      p.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }
    return p;
  }, []);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Period Selector & Config Bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Filter size={16} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>
            {isRtl ? 'فترة الرواتب' : 'Payroll Period'}:
          </span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              color: 'var(--text-main)', padding: '8px 12px', borderRadius: '8px',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer'
            }}
          >
            {periods.map(p => (
              <option key={p} value={p}>
                {new Date(p + '-01').toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' })}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
            background: summary.totalEmployees > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            color: summary.totalEmployees > 0 ? '#10B981' : '#F59E0B'
          }}>
            {isRtl ? `معدل` : `Avg Net:`} {formatCurrency(summary.averageNetSalary, lang)}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <StatCard
          id="payroll-total-employees"
          title={isRtl ? 'إجمالي الموظفين' : 'Total Employees'}
          value={summary.totalEmployees}
          subtitle={isRtl ? `فترة: ${selectedPeriod}` : `Period: ${selectedPeriod}`}
          icon={<Users size={20} />}
        />
        <StatCard
          id="payroll-total-gross"
          title={isRtl ? 'إجمالي الراتب الإجمالي' : 'Total Gross Salary'}
          value={formatCurrency(summary.totalGrossSalary, lang)}
          subtitle={isRtl ? 'المstrictات والبدائل' : 'Before deductions'}
          icon={<Wallet size={20} />}
          colorClass="gradient-text"
        />
        <StatCard
          id="payroll-total-deductions"
          title={isRtl ? 'إجمالي الخصومات' : 'Total Deductions'}
          value={formatCurrency(summary.totalDeductions, lang)}
          subtitle={isRtl ? 'الضرائب والتأمين' : 'Tax & Insurance'}
          icon={<TrendingDown size={20} />}
          colorClass="text-red-400"
        />
        <StatCard
          id="payroll-total-net"
          title={isRtl ? 'صافي الرواتب' : 'Total Net Pay'}
          value={formatCurrency(summary.totalNetSalary, lang)}
          subtitle={isRtl ? 'بعد جميع الخصومات' : 'After all deductions'}
          icon={<Receipt size={20} />}
          colorClass="text-emerald-400"
        />
        <StatCard
          id="payroll-employer-cost"
          title={isRtl ? 'تكلفة صاحب العمل' : 'Total Employer Cost'}
          value={formatCurrency(summary.totalEmployerCost, lang)}
          subtitle={isRtl ? 'الراتب + التأمين' : 'Salary + Social Insurance'}
          icon={<CreditCard size={20} />}
        />
        <StatCard
          id="payroll-avg-net"
          title={isRtl ? 'متوسط صافي الراتب' : 'Average Net Pay'}
          value={formatCurrency(summary.averageNetSalary, lang)}
          subtitle={isRtl ? 'لكل موظف' : 'Per employee'}
          icon={<Calculator size={20} />}
          colorClass="gradient-text"
        />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Department Average Salary Chart */}
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
            {isRtl ? 'متوسط الرواتب حسب القسم' : 'Average Salary by Department'}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis dataKey="name" type="category" width={120} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                  borderRadius: '8px', fontSize: '12px'
                }}
                formatter={(value) => [formatCurrency(Number(value), lang), '']}
              />
              <Legend />
              <Bar dataKey="gross" name={isRtl ? 'الإجمالي' : 'Gross'} fill="#8B5CF6" radius={[0, 4, 4, 0]} />
              <Bar dataKey="net" name={isRtl ? 'الصافي' : 'Net'} fill="#10B981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Deduction Breakdown Pie */}
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
            {isRtl ? 'توزيع الخصومات' : 'Deduction Breakdown'}
          </h3>
          {deductionPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deductionPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={(props: { name?: string; percent?: number }) => `${props.name ?? ''} ${((props.percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {deductionPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                    borderRadius: '8px', fontSize: '12px'
                  }}
                  formatter={(value) => [formatCurrency(Number(value), lang), '']}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
              {isRtl ? 'لا توجد بيانات' : 'No data available'}
            </div>
          )}
        </div>

        {/* Net Salary Distribution */}
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
            {isRtl ? 'توزيع صافي الراتب' : 'Net Salary Distribution'}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salaryDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                  borderRadius: '8px', fontSize: '12px'
                }}
              />
              <Area type="monotone" dataKey="count" name={isRtl ? 'الموظفين' : 'Employees'} stroke="#8B5CF6" fill="url(#payrollGradient)" />
              <defs>
                <linearGradient id="payrollGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payroll Detail Table */}
      <div className="glass-panel-noclick" style={{ padding: '20px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
            {isRtl ? 'تفاصيل الرواتب' : 'Payroll Details'}
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
            {summary.totalEmployees} {isRtl ? 'سجل' : 'records'}
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              {[
                '', isRtl ? 'الموظف' : 'Employee', isRtl ? 'القسم' : 'Department',
                isRtl ? 'الإجمالي' : 'Gross', isRtl ? 'الضرائب' : 'Tax',
                isRtl ? 'التأمين' : 'S.I.', isRtl ? 'الصافي' : 'Net', isRtl ? 'الحالة' : 'Status'
              ].map((h, i) => (
                <th key={i} style={{
                  padding: '10px 12px', textAlign: isRtl ? 'right' : 'left',
                  color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap'
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payrollRecords.slice(0, 20).map((rec) => (
              <React.Fragment key={rec.id}>
                <tr
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                  onClick={() => toggleRow(rec.id)}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 12px', width: '30px', color: 'var(--text-dim)' }}>
                    {expandedRow === rec.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </td>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-main)' }}>
                    {rec.employeeName}
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{rec.department}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--accent-cyan)' }}>
                    {formatCurrency(rec.grossSalary, lang)}
                  </td>
                  <td style={{ padding: '10px 12px', color: '#EF4444' }}>
                    {formatCurrency(rec.incomeTax + rec.martyrsTax, lang)}
                  </td>
                  <td style={{ padding: '10px 12px', color: '#F59E0B' }}>
                    {formatCurrency(rec.socialInsuranceEmployee, lang)}
                  </td>
                  <td style={{ padding: '10px 12px', fontWeight: 700, color: '#10B981' }}>
                    {formatCurrency(rec.netSalary, lang)}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                      background: rec.status === 'paid' ? 'rgba(16,185,129,0.15)' :
                                  rec.status === 'processed' ? 'rgba(139,92,246,0.15)' :
                                  'rgba(245,158,11,0.15)',
                      color: rec.status === 'paid' ? '#10B981' :
                             rec.status === 'processed' ? '#8B5CF6' : '#F59E0B'
                    }}>
                      {isRtl ? (rec.status === 'draft' ? 'مسودة' : rec.status === 'processed' ? 'معالج' : rec.status === 'paid' ? 'مدفوع' : 'مسوية') : rec.status}
                    </span>
                  </td>
                </tr>
                {expandedRow === rec.id && (
                  <tr>
                    <td colSpan={8} style={{ padding: '12px 24px', background: 'rgba(139, 92, 246, 0.03)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <div>
                          <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            {isRtl ? 'الرواتب' : 'Earnings'}
                          </span>
                          <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--text-muted)' }}>{isRtl ? 'الراتب الأساسي' : 'Basic Salary'}</span>
                              <span style={{ color: 'var(--text-main)' }}>{formatCurrency(rec.basicSalary, lang)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--text-muted)' }}>{isRtl ? 'بدل السكن' : 'Housing'}</span>
                              <span style={{ color: 'var(--text-main)' }}>{formatCurrency(rec.housingAllowance, lang)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--text-muted)' }}>{isRtl ? 'بدل النقل' : 'Transport'}</span>
                              <span style={{ color: 'var(--text-main)' }}>{formatCurrency(rec.transportAllowance, lang)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--text-muted)' }}>{isRtl ? 'العمل الإضافي' : 'Overtime'}</span>
                              <span style={{ color: 'var(--text-main)' }}>{formatCurrency(rec.overtimePay, lang)}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            {isRtl ? 'الخصومات' : 'Deductions'}
                          </span>
                          <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--text-muted)' }}>{isRtl ? 'ضريبة الدخل' : 'Income Tax'}</span>
                              <span style={{ color: '#EF4444' }}>-{formatCurrency(rec.incomeTax, lang)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--text-muted)' }}>{isRtl ? 'التأمين' : 'Social Insurance'}</span>
                              <span style={{ color: '#EF4444' }}>-{formatCurrency(rec.socialInsuranceEmployee, lang)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--text-muted)' }}>{isRtl ? 'ضريبة الشهداء' : 'Martyrs Tax'}</span>
                              <span style={{ color: '#EF4444' }}>-{formatCurrency(rec.martyrsTax, lang)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--text-muted)' }}>{isRtl ? 'تأمين صحي' : 'Health Insurance'}</span>
                              <span style={{ color: '#EF4444' }}>-{formatCurrency(rec.insuranceDeduction, lang)}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            {isRtl ? 'تكلفة صاحب العمل' : 'Employer Cost'}
                          </span>
                          <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: 'var(--text-muted)' }}>{isRtl ? 'ضمان اجتماعي' : 'Social Insurance (ER)'}</span>
                              <span style={{ color: '#F59E0B' }}>{formatCurrency(rec.socialInsuranceEmployer, lang)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid var(--border-color)', paddingTop: '4px' }}>
                              <span style={{ color: 'var(--text-main)' }}>{isRtl ? 'الإجمالي' : 'Total Cost'}</span>
                              <span style={{ color: 'var(--accent-purple)' }}>{formatCurrency(rec.totalEmployerCost, lang)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {payrollRecords.length > 20 && (
          <div style={{
            padding: '12px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px',
            borderTop: '1px solid var(--border-color)', marginTop: '8px'
          }}>
            {isRtl ? `عرض 20 من ${payrollRecords.length} سجل` : `Showing 20 of ${payrollRecords.length} records`}
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollTab;