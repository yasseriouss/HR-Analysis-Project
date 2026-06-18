import React, { useMemo, useState } from 'react';
import type { Employee } from '../types/employee';
import type { ExpenseClaim, ExpenseStatus, ExpenseCategory } from '../types/expense';
import { EXPENSE_CATEGORY_LABELS, EXPENSE_STATUS_LABELS } from '../types/expense';
import { StatCard } from './StatCard';
import { formatCurrency } from '../utils/payrollEngine';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ReceiptText, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Language } from '../utils/i18n';

interface ExpensesTabProps { data: Employee[]; lang: Language; }

function generateExpenses(employees: Employee[]): ExpenseClaim[] {
  const categories: ExpenseCategory[] = ['travel', 'meals', 'equipment', 'training', 'transport', 'other'];
  const statuses: ExpenseStatus[] = ['pending', 'approved', 'rejected', 'reimbursed'];
  const descs = ['Flight tickets', 'Client dinner', 'Office chair', 'Conference fee', 'Taxi fare', 'Software license',
    'Hotel stay', 'Team lunch', 'Laptop', 'Online course', 'Fuel', 'Stationery'];
  const approvers = ['Ahmed Hassan', 'Sarah Ibrahim', 'Mohamed Ali'];

  return employees.slice(0, 20).map((emp, i) => ({
    id: `EXP-${i + 1}`,
    employeeId: emp.EmpID,
    employeeName: `Employee #${emp.EmployeeNumber}`,
    department: emp.Department,
    category: categories[i % categories.length],
    description: descs[i % descs.length],
    amount: Math.round(emp.MonthlyIncome * (0.05 + (i % 8) * 0.02)),
    status: statuses[i % statuses.length],
    submittedDate: `2026-06-${String(((i % 28) + 1)).padStart(2, '0')}`,
    approvedDate: statuses[i % statuses.length] === 'reimbursed' ? `2026-06-${String(((i % 20) + 5)).padStart(2, '0')}` : undefined,
    approvedBy: statuses[i % statuses.length] === 'approved' || statuses[i % statuses.length] === 'reimbursed' ? approvers[i % approvers.length] : undefined,
  }));
}

const PIE_COLORS = ['#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

export const ExpensesTab: React.FC<ExpensesTabProps> = ({ data, lang }) => {
  const isRtl = lang === 'ar';
  const [statusFilter, setStatusFilter] = useState<ExpenseStatus | 'all'>('all');

  const expenses = useMemo(() => generateExpenses(data), [data]);
  const filtered = useMemo(() => statusFilter === 'all' ? expenses : expenses.filter(e => e.status === statusFilter), [expenses, statusFilter]);

  const summary = useMemo(() => {
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    const pending = expenses.filter(e => e.status === 'pending').length;
    const approved = expenses.filter(e => e.status === 'approved' || e.status === 'reimbursed').length;
    const rejected = expenses.filter(e => e.status === 'rejected').length;
    const pendingAmount = expenses.filter(e => e.status === 'pending').reduce((s, e) => s + e.amount, 0);
    return { total, pending, approved, rejected, pendingAmount, count: expenses.length };
  }, [expenses]);

  const statusPieData = [
    { name: isRtl ? 'معلق' : 'Pending', value: summary.pending },
    { name: isRtl ? 'معتمد' : 'Approved', value: summary.approved },
    { name: isRtl ? 'مرفوض' : 'Rejected', value: summary.rejected },
  ].filter(s => s.value > 0);

  const categoryData = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    expenses.forEach(e => {
      const label = EXPENSE_CATEGORY_LABELS[e.category][lang];
      if (!map[label]) map[label] = { total: 0, count: 0 };
      map[label].total += e.amount;
      map[label].count++;
    });
    return Object.entries(map).map(([name, vals]) => ({ name, avg: Math.round(vals.total / vals.count), total: vals.total, count: vals.count }));
  }, [expenses, lang]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <StatCard id="exp-total" title={isRtl ? 'إجمالي المطالبات' : 'Total Claims'} value={formatCurrency(summary.total, lang)} subtitle={`${summary.count} ${isRtl ? 'مطالبة' : 'claims'}`} icon={<ReceiptText size={18} />} />
        <StatCard id="exp-pending" title={isRtl ? 'قيد الانتظار' : 'Pending'} value={formatCurrency(summary.pendingAmount, lang)} subtitle={`${summary.pending} ${isRtl ? 'مطالبة' : 'claims'}`} icon={<Clock size={18} />} colorClass="text-amber-400" glowing={summary.pending > 0} />
        <StatCard id="exp-approved" title={isRtl ? 'معتمدة' : 'Approved'} value={summary.approved} icon={<CheckCircle size={18} />} colorClass="text-emerald-400" />
        <StatCard id="exp-rejected" title={isRtl ? 'مرفوضة' : 'Rejected'} value={summary.rejected} icon={<XCircle size={18} />} colorClass="text-red-400" glowing={summary.rejected > 0} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>{isRtl ? 'حالة المطالبات' : 'Claim Status'}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart><Pie data={statusPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label>
              {statusPieData.map((_, i) => (<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />))}
            </Pie><Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px' }} /></PieChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>{isRtl ? 'المصاريف حسب الفئة' : 'Expenses by Category'}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px' }} formatter={(v) => [formatCurrency(Number(v), lang), '']} />
              <Bar dataKey="total" name={isRtl ? 'الإجمالي' : 'Total'} fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Table with Approval */}
      <div className="glass-panel-noclick" style={{ padding: '16px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>{isRtl ? 'طلبات المصروفات' : 'Expense Requests'}</h3>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as ExpenseStatus | 'all')}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '6px 12px', borderRadius: '8px', fontSize: '12px' }}>
            <option value="all">{isRtl ? 'الكل' : 'All'}</option>
            {Object.entries(EXPENSE_STATUS_LABELS).map(([k, v]) => (<option key={k} value={k}>{v[lang]}</option>))}
          </select>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead><tr style={{ borderBottom: '2px solid var(--border-color)' }}>
            {[isRtl ? 'الموظف' : 'Employee', isRtl ? 'الفئة' : 'Category', isRtl ? 'الوصف' : 'Description', isRtl ? 'المبلغ' : 'Amount', isRtl ? 'الحالة' : 'Status', isRtl ? 'التاريخ' : 'Date', ''].map((h, i) => (
              <th key={i} style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
            ))}</tr></thead>
          <tbody>
            {filtered.map((exp) => (
              <tr key={exp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-main)' }}>{exp.employeeName}</td>
                <td style={{ padding: '8px 10px', color: 'var(--text-muted)' }}>{EXPENSE_CATEGORY_LABELS[exp.category].icon} {EXPENSE_CATEGORY_LABELS[exp.category][lang]}</td>
                <td style={{ padding: '8px 10px', color: 'var(--text-main)' }}>{exp.description}</td>
                <td style={{ padding: '8px 10px', fontWeight: 700, color: 'var(--accent-cyan)' }}>{formatCurrency(exp.amount, lang)}</td>
                <td style={{ padding: '8px 10px' }}><span style={{
                  padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600,
                  background: EXPENSE_STATUS_LABELS[exp.status].color + '18', color: EXPENSE_STATUS_LABELS[exp.status].color
                }}>{EXPENSE_STATUS_LABELS[exp.status][lang]}</span></td>
                <td style={{ padding: '8px 10px', color: 'var(--text-dim)', fontSize: '11px' }}>{exp.submittedDate}</td>
                <td style={{ padding: '8px 10px' }}>
                  {exp.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button style={{ padding: '3px 8px', borderRadius: '6px', border: 'none', background: 'rgba(16,185,129,0.12)', color: '#10B981', cursor: 'pointer', fontSize: '10px', fontWeight: 600 }}>
                        {isRtl ? 'اعتماد' : 'Approve'}
                      </button>
                      <button style={{ padding: '3px 8px', borderRadius: '6px', border: 'none', background: 'rgba(239,68,68,0.12)', color: '#EF4444', cursor: 'pointer', fontSize: '10px', fontWeight: 600 }}>
                        {isRtl ? 'رفض' : 'Reject'}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpensesTab;