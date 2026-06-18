import React, { useMemo } from 'react';
import type { Employee } from '../types/employee';
import { StatCard } from './StatCard';
import { formatCurrency } from '../utils/payrollEngine';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calculator, DollarSign, Clock, TrendingUp } from 'lucide-react';
import type { Language } from '../utils/i18n';

interface GratuityCalculatorProps {
  data: Employee[];
  lang: Language;
}

/**
 * Egyptian EOSB/Gratuity calculation based on Labor Law
 * Article 126: 
 * - Less than 1 year: No gratuity
 * - 1 to 5 years: 2 months salary per year
 * - More than 5 years: 2 months for first 5 years, 3 months for subsequent years
 * - Maximum: 2 years total salary
 */
function calculateGratuity(yearsOfService: number, monthlySalary: number): {
  gratuityAmount: number;
  monthsPerYear: number;
  detail: string;
} {
  if (yearsOfService < 1) {
    return { gratuityAmount: 0, monthsPerYear: 0, detail: 'Less than 1 year - No gratuity' };
  }

  let monthsPerYear: number;
  let detail: string;

  if (yearsOfService <= 5) {
    monthsPerYear = 2;
    detail = '2 months salary per year (Article 126)';
  } else {
    monthsPerYear = 3;
    detail = '3 months salary per year (beyond 5 years)';
  }

  // Calculate gratuity
  let gratuityAmount: number;
  if (yearsOfService <= 5) {
    gratuityAmount = yearsOfService * monthsPerYear * monthlySalary;
  } else {
    // First 5 years at 2 months, remaining at 3 months
    gratuityAmount = 5 * 2 * monthlySalary + (yearsOfService - 5) * 3 * monthlySalary;
  }

  // Cap at maximum 2 years salary
  const maxGratuity = 24 * monthlySalary;
  gratuityAmount = Math.min(gratuityAmount, maxGratuity);

  return { gratuityAmount, monthsPerYear, detail };
}

export const GratuityCalculator: React.FC<GratuityCalculatorProps> = ({ data, lang }) => {
  const isRtl = lang === 'ar';

  // Calculate gratuity for all employees
  const gratuityData = useMemo(() => {
    return data.map(emp => {
      const years = emp.YearsAtCompany;
      const monthlySalary = emp.MonthlyIncome;
      const result = calculateGratuity(years, monthlySalary);
      return {
        employeeId: emp.EmpID,
        employeeName: `Employee #${emp.EmployeeNumber}`,
        department: emp.Department,
        yearsOfService: years,
        monthlySalary,
        gratuityAmount: result.gratuityAmount,
        monthsPerYear: result.monthsPerYear,
        detail: result.detail,
      };
    }).sort((a, b) => b.gratuityAmount - a.gratuityAmount);
  }, [data]);

  // Summary KPIs
  const summary = useMemo(() => {
    const total = gratuityData.reduce((sum, g) => sum + g.gratuityAmount, 0);
    const avg = gratuityData.length > 0 ? total / gratuityData.length : 0;
    const eligible = gratuityData.filter(g => g.gratuityAmount > 0).length;
    const max = gratuityData.reduce((m, g) => Math.max(m, g.gratuityAmount), 0);
    return { total, avg, eligible, max, count: gratuityData.length };
  }, [gratuityData]);

  // Department breakdown
  const deptData = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    gratuityData.forEach(g => {
      if (!map[g.department]) map[g.department] = { total: 0, count: 0 };
      map[g.department].total += g.gratuityAmount;
      map[g.department].count++;
    });
    return Object.entries(map).map(([dept, vals]) => ({
      name: dept,
      gratuity: Math.round(vals.total / vals.count),
      totalLiability: Math.round(vals.total),
      employees: vals.count,
    }));
  }, [gratuityData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <StatCard
          id="gratuity-total"
          title={isRtl ? 'إجمالي مخصص المكافآت' : 'Total Gratuity Liability'}
          value={formatCurrency(summary.total, lang)}
          subtitle={isRtl ? 'لجميع الموظفين المؤهلين' : 'For all eligible employees'}
          icon={<DollarSign size={20} />}
          colorClass="text-amber-400"
        />
        <StatCard
          id="gratuity-avg"
          title={isRtl ? 'متوسط المكافأة' : 'Average Gratuity'}
          value={formatCurrency(summary.avg, lang)}
          subtitle={`${summary.eligible} ${isRtl ? 'موظف مؤهل' : 'eligible employees'}`}
          icon={<Calculator size={20} />}
        />
        <StatCard
          id="gratuity-max"
          title={isRtl ? 'أعلى مكافأة' : 'Highest Gratuity'}
          value={formatCurrency(summary.max, lang)}
          subtitle={isRtl ? 'حد أقصى 24 شهر' : 'Max 24 months'}
          icon={<TrendingUp size={20} />}
        />
        <StatCard
          id="gratuity-eligible"
          title={isRtl ? 'الموظفون المؤهلون' : 'Eligible Employees'}
          value={`${summary.eligible} / ${summary.count}`}
          subtitle={`${((summary.eligible / summary.count) * 100).toFixed(1)}% ${isRtl ? 'مؤهلون' : 'eligible'}`}
          icon={<Clock size={20} />}
        />
      </div>

      {/* Department Chart */}
      <div className="glass-panel-noclick" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
          {isRtl ? 'متوسط مكافأة نهاية الخدمة حسب القسم' : 'Average EOSB by Department'}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={deptData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px' }}
              formatter={(value) => [formatCurrency(Number(value), lang), '']}
            />
            <Legend />
            <Bar dataKey="gratuity" name={isRtl ? 'المتوسط' : 'Avg Gratuity'} fill="#F59E0B" radius={[4, 4, 0, 0]} />
            <Bar dataKey="totalLiability" name={isRtl ? 'الإجمالي' : 'Total Liability'} fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gratuity Calculation Rules */}
      <div className="glass-panel-noclick" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
          {isRtl ? 'قواعد حساب مكافأة نهاية الخدمة (المادة 126)' : 'EOSB Calculation Rules (Article 126)'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', fontSize: '13px' }}>
          <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ fontWeight: 700, color: '#10B981', marginBottom: '8px' }}>
              {isRtl ? '1 - 5 سنوات خدمة' : '1 - 5 Years of Service'}
            </div>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              {isRtl ? 'شهرين من الراتب عن كل سنة خدمة' : '2 months salary per year of service'}
            </p>
          </div>
          <div style={{ padding: '16px', background: 'rgba(139, 92, 246, 0.08)', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <div style={{ fontWeight: 700, color: '#8B5CF6', marginBottom: '8px' }}>
              {isRtl ? 'أكثر من 5 سنوات خدمة' : 'More than 5 Years of Service'}
            </div>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              {isRtl ? '3 أشهر من الراتب عن كل سنة إضافية' : '3 months salary per additional year'}
            </p>
          </div>
          <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <div style={{ fontWeight: 700, color: '#F59E0B', marginBottom: '8px' }}>
              {isRtl ? 'الحد الأقصى' : 'Maximum Cap'}
            </div>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
              {isRtl ? 'حد أقصى 24 شهر راتب' : 'Maximum 24 months salary'}
            </p>
          </div>
        </div>
      </div>

      {/* Top 10 Gratuity Table */}
      <div className="glass-panel-noclick" style={{ padding: '20px', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
          {isRtl ? 'أعلى 10 مكافآت نهاية خدمة' : 'Top 10 Gratuity Amounts'}
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              {[isRtl ? 'الموظف' : 'Employee', isRtl ? 'القسم' : 'Department', 
                isRtl ? 'سنوات الخدمة' : 'Years', isRtl ? 'الراتب الشهري' : 'Monthly Salary',
                isRtl ? 'المكافأة' : 'Gratuity', isRtl ? 'التفاصيل' : 'Details'
              ].map((h, i) => (
                <th key={i} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gratuityData.slice(0, 10).map((g, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-main)' }}>{g.employeeName}</td>
                <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{g.department}</td>
                <td style={{ padding: '10px 12px', color: 'var(--text-main)' }}>{g.yearsOfService}</td>
                <td style={{ padding: '10px 12px', color: 'var(--accent-cyan)' }}>{formatCurrency(g.monthlySalary, lang)}</td>
                <td style={{ padding: '10px 12px', fontWeight: 700, color: '#F59E0B' }}>{formatCurrency(g.gratuityAmount, lang)}</td>
                <td style={{ padding: '10px 12px', color: 'var(--text-dim)', fontSize: '11px' }}>{g.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GratuityCalculator;