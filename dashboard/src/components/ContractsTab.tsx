import React, { useState, useMemo } from 'react';
import type { Employee } from '../types/employee';
import type { Contract, ContractStatus } from '../types/contract';
import { CONTRACT_TYPE_LABELS, CONTRACT_STATUS_LABELS } from '../types/contract';
import { StatCard } from './StatCard';
import { formatCurrency } from '../utils/payrollEngine';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
  FileText, AlertTriangle, CheckCircle, Clock, RefreshCw,
  ChevronDown, ChevronUp, Search
} from 'lucide-react';
import type { Language } from '../utils/i18n';

interface ContractsTabProps {
  data: Employee[];
  lang: Language;
}

const STATUS_COLORS: Record<ContractStatus, string> = {
  'active': '#10B981',
  'expired': '#EF4444',
  'renewed': '#06B6D4',
  'terminated': '#6B7280',
  'pending-renewal': '#F59E0B',
};

/**
 * Generate deterministic contract data from employee records
 */
function generateContracts(employees: Employee[]): Contract[] {
  const contractTypes: Array<'fixed-term' | 'unlimited' | 'part-time' | 'probation'> = 
    ['fixed-term', 'unlimited', 'part-time', 'probation'];
  const statuses: ContractStatus[] = ['active', 'active', 'active', 'expired', 'pending-renewal', 'renewed'];

  return employees.map((emp, i) => {
    const seed = emp.EmployeeNumber || i;
    const contractType = contractTypes[seed % contractTypes.length];
    const status = statuses[seed % statuses.length];
    const startYear = 2020 + (seed % 6);
    const startMonth = (seed % 12) + 1;
    const startDate = `${startYear}-${String(startMonth).padStart(2, '0')}-${String((seed % 28) + 1).padStart(2, '0')}`;
    
    let endDate: string | undefined;
    if (contractType === 'fixed-term') {
      const endYear = startYear + 2 + (seed % 2);
      endDate = `${endYear}-${String(startMonth).padStart(2, '0')}-${String((seed % 28) + 1).padStart(2, '0')}`;
    } else if (contractType === 'part-time') {
      const endYear = startYear + 1;
      endDate = `${endYear}-${String(startMonth).padStart(2, '0')}-${String((seed % 28) + 1).padStart(2, '0')}`;
    }

    const probationEnd = new Date(startDate);
    probationEnd.setMonth(probationEnd.getMonth() + 3);

    return {
      id: `CTR-${emp.EmpID}`,
      employeeId: emp.EmpID,
      employeeName: `Employee #${emp.EmployeeNumber}`,
      department: emp.Department,
      jobRole: emp.JobRole,
      contractType,
      status,
      startDate,
      endDate,
      probationEndDate: probationEnd.toISOString().split('T')[0],
      renewalCount: seed % 4,
      salary: emp.MonthlyIncome,
    };
  });
}

const PIE_CHART_COLORS = ['#10B981', '#EF4444', '#F59E0B', '#6B7280', '#06B6D4'];

export const ContractsTab: React.FC<ContractsTabProps> = ({ data, lang }) => {
  const isRtl = lang === 'ar';
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const contracts = useMemo(() => generateContracts(data), [data]);

  // Summary KPIs
  const summary = useMemo(() => {
    const active = contracts.filter(c => c.status === 'active').length;
    const expiringSoon = contracts.filter(c => {
      if (!c.endDate) return false;
      const end = new Date(c.endDate);
      const now = new Date();
      const diff = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return diff > 0 && diff <= 90;
    }).length;
    const expired = contracts.filter(c => c.status === 'expired').length;
    const pendingRenewal = contracts.filter(c => c.status === 'pending-renewal').length;

    return { total: contracts.length, active, expiringSoon, expired, pendingRenewal };
  }, [contracts]);

  // Status distribution for pie chart
  const statusPieData = useMemo(() => {
    const counts: Record<string, number> = {};
    contracts.forEach(c => {
      const label = CONTRACT_STATUS_LABELS[c.status][lang];
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [contracts, lang]);

  // Department breakdown
  const deptBreakdown = useMemo(() => {
    const map: Record<string, { total: number; active: number; expired: number }> = {};
    contracts.forEach(c => {
      if (!map[c.department]) map[c.department] = { total: 0, active: 0, expired: 0 };
      map[c.department].total++;
      if (c.status === 'active') map[c.department].active++;
      if (c.status === 'expired') map[c.department].expired++;
    });
    return Object.entries(map).map(([dept, vals]) => ({
      name: dept,
      total: vals.total,
      active: vals.active,
      expired: vals.expired,
    }));
  }, [contracts]);

  // Filtered contracts
  const filteredContracts = useMemo(() => {
    return contracts.filter(c => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (!c.employeeName.toLowerCase().includes(term) && 
            !c.department.toLowerCase().includes(term) &&
            !c.jobRole.toLowerCase().includes(term)) return false;
      }
      return true;
    });
  }, [contracts, statusFilter, searchTerm]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <StatCard
          id="contracts-total"
          title={isRtl ? 'إجمالي العقود' : 'Total Contracts'}
          value={summary.total}
          subtitle={isRtl ? 'جميع العقود' : 'All contracts'}
          icon={<FileText size={20} />}
        />
        <StatCard
          id="contracts-active"
          title={isRtl ? 'العقود النشطة' : 'Active Contracts'}
          value={summary.active}
          subtitle={`${((summary.active / summary.total) * 100).toFixed(1)}%`}
          icon={<CheckCircle size={20} />}
          colorClass="text-emerald-400"
        />
        <StatCard
          id="contracts-expiring"
          title={isRtl ? 'تنتهي خلال 90 يوم' : 'Expiring Soon'}
          value={summary.expiringSoon}
          subtitle={isRtl ? 'تحتاج تجديد' : 'Needs renewal'}
          icon={<AlertTriangle size={20} />}
          colorClass="text-amber-400"
          glowing={summary.expiringSoon > 0}
        />
        <StatCard
          id="contracts-expired"
          title={isRtl ? 'العقود المنتهية' : 'Expired Contracts'}
          value={summary.expired}
          subtitle={isRtl ? 'منتهية الصلاحية' : 'Past end date'}
          icon={<Clock size={20} />}
          colorClass="text-red-400"
        />
        <StatCard
          id="contracts-pending"
          title={isRtl ? 'بانتظار التجديد' : 'Pending Renewal'}
          value={summary.pendingRenewal}
          subtitle={isRtl ? 'تحتاج مراجعة' : 'Awaiting review'}
          icon={<RefreshCw size={20} />}
        />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        {/* Status Distribution Pie */}
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
            {isRtl ? 'توزيع حالات العقود' : 'Contract Status Distribution'}
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusPieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                {statusPieData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                  borderRadius: '8px', fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department Breakdown Bar */}
        <div className="glass-panel-noclick" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
            {isRtl ? 'العقود حسب القسم' : 'Contracts by Department'}
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={deptBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px' }} />
              <Legend />
              <Bar dataKey="active" name={isRtl ? 'نشط' : 'Active'} fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expired" name={isRtl ? 'منتهي' : 'Expired'} fill="#EF4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="total" name={isRtl ? 'الإجمالي' : 'Total'} fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="glass-panel-noclick" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>
            {isRtl ? 'سجلات العقود' : 'Contract Records'}
          </h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder={isRtl ? 'بحث...' : 'Search...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                  color: 'var(--text-main)', padding: '8px 12px 8px 32px', borderRadius: '8px',
                  fontSize: '13px', width: '180px'
                }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ContractStatus | 'all')}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                color: 'var(--text-main)', padding: '8px 12px', borderRadius: '8px', fontSize: '13px'
              }}
            >
              <option value="all">{isRtl ? 'جميع الحالات' : 'All Statuses'}</option>
              {Object.entries(CONTRACT_STATUS_LABELS).map(([key, labels]) => (
                <option key={key} value={key}>{labels[lang]}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                {['', isRtl ? 'الموظف' : 'Employee', isRtl ? 'القسم' : 'Department', 
                  isRtl ? 'نوع العقد' : 'Type', isRtl ? 'الحالة' : 'Status',
                  isRtl ? 'تاريخ البداية' : 'Start Date', isRtl ? 'تاريخ الانتهاء' : 'End Date',
                  isRtl ? 'الراتب' : 'Salary', isRtl ? 'التجديد' : 'Renewals'
                ].map((h, i) => (
                  <th key={i} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredContracts.slice(0, 25).map((contract) => (
                <React.Fragment key={contract.id}>
                  <tr
                    style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background 0.15s ease' }}
                    onClick={() => setExpandedRow(expandedRow === contract.id ? null : contract.id)}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '10px 12px', width: '30px', color: 'var(--text-dim)' }}>
                      {expandedRow === contract.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-main)' }}>{contract.employeeName}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{contract.department}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                        background: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6'
                      }}>
                        {CONTRACT_TYPE_LABELS[contract.contractType][lang]}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                        background: `${STATUS_COLORS[contract.status]}20`, color: STATUS_COLORS[contract.status]
                      }}>
                        {CONTRACT_STATUS_LABELS[contract.status][lang]}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-muted)', fontSize: '12px' }}>{contract.startDate}</td>
                    <td style={{ padding: '10px 12px', color: contract.endDate ? 'var(--text-muted)' : 'var(--text-dim)', fontSize: '12px' }}>
                      {contract.endDate || (isRtl ? 'غير محدد' : 'Unlimited')}
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                      {formatCurrency(contract.salary, lang)}
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-muted)', textAlign: 'center' }}>
                      {contract.renewalCount}
                    </td>
                  </tr>
                  {expandedRow === contract.id && (
                    <tr>
                      <td colSpan={9} style={{ padding: '12px 24px', background: 'rgba(139, 92, 246, 0.03)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', fontSize: '12px' }}>
                          <div>
                            <span style={{ color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '11px' }}>
                              {isRtl ? 'الدور الوظيفي' : 'Job Role'}
                            </span>
                            <p style={{ color: 'var(--text-main)', marginTop: '4px' }}>{contract.jobRole}</p>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '11px' }}>
                              {isRtl ? 'تاريخ انتهاء التجربة' : 'Probation End'}
                            </span>
                            <p style={{ color: 'var(--text-main)', marginTop: '4px' }}>{contract.probationEndDate}</p>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '11px' }}>
                              {isRtl ? 'آخر تجديد' : 'Last Renewal'}
                            </span>
                            <p style={{ color: 'var(--text-main)', marginTop: '4px' }}>{contract.lastRenewalDate || '-'}</p>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '11px' }}>
                              {isRtl ? 'معرّف العقد' : 'Contract ID'}
                            </span>
                            <p style={{ color: 'var(--text-main)', marginTop: '4px' }}>{contract.id}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {filteredContracts.length > 25 && (
          <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px', borderTop: '1px solid var(--border-color)', marginTop: '8px' }}>
            {isRtl ? `عرض 25 من ${filteredContracts.length} سجل` : `Showing 25 of ${filteredContracts.length} records`}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractsTab;