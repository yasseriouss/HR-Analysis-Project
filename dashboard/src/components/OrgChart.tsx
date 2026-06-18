import React, { useMemo, useState } from 'react';
import type { Employee } from '../types/employee';
import { Users, ChevronDown, ChevronRight, Search, Building2 } from 'lucide-react';
import type { Language } from '../utils/i18n';

interface OrgChartProps { data: Employee[]; lang: Language; }

interface OrgNode {
  id: string;
  name: string;
  role: string;
  count: number;
  children?: OrgNode[];
}

function buildOrgTree(employees: Employee[], lang: string): OrgNode {
  // Build department hierarchy
  const deptMap: Record<string, { roles: Record<string, Employee[]> }> = {};
  
  employees.forEach(emp => {
    if (!deptMap[emp.Department]) deptMap[emp.Department] = { roles: {} };
    if (!deptMap[emp.Department].roles[emp.JobRole]) deptMap[emp.Department].roles[emp.JobRole] = [];
    deptMap[emp.Department].roles[emp.JobRole].push(emp);
  });

  // CEO/Company root
  const companyNode: OrgNode = {
    id: 'company',
    name: lang === 'ar' ? 'الشركة' : 'Company',
    role: `CEO • ${employees.length} ${lang === 'ar' ? 'موظف' : 'employees'}`,
    count: employees.length,
    children: Object.entries(deptMap).map(([dept, deptData]) => ({
      id: `dept-${dept}`,
      name: dept,
      role: `${lang === 'ar' ? 'قسم' : 'Department'} • ${Object.values(deptData.roles).flat().length} ${lang === 'ar' ? 'موظف' : 'staff'}`,
      count: Object.values(deptData.roles).flat().length,
      children: Object.entries(deptData.roles).map(([role, emps]) => ({
        id: `role-${dept}-${role}`,
        name: role,
        role: `${emps.length} ${lang === 'ar' ? 'موظف' : 'employees'}`,
        count: emps.length,
      })).sort((a, b) => b.count - a.count),
    })).sort((a, b) => b.count - a.count),
  };

  return companyNode;
}

export const OrgChart: React.FC<OrgChartProps> = ({ data, lang }) => {
  const isRtl = lang === 'ar';
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['company']));
  const [searchTerm, setSearchTerm] = useState('');

  const tree = useMemo(() => buildOrgTree(data, lang), [data, lang]);

  // Department stats
  const deptStats = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach(e => { map[e.Department] = (map[e.Department] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [data]);

  const toggleNode = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const renderNode = (node: OrgNode, depth: number) => {
    const isExpanded = expanded.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isMatch = !searchTerm || 
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.role.toLowerCase().includes(searchTerm.toLowerCase());

    if (!isMatch && !hasChildren) return null;
    
    // Check if any children match search
    if (searchTerm && !isMatch) {
      const childMatches = node.children?.some(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.children?.some(gc => gc.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      if (!childMatches) return null;
    }

    return (
      <div key={node.id}>
        <div
          onClick={() => toggleNode(node.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
            marginLeft: `${depth * 20}px`, borderRadius: '8px', cursor: 'pointer',
            transition: 'all 0.15s ease', border: '1px solid transparent',
            background: depth === 0 ? 'rgba(139, 92, 246, 0.08)' : depth === 1 ? 'rgba(6, 182, 212, 0.05)' : 'transparent',
            borderColor: depth === 0 ? 'rgba(139, 92, 246, 0.2)' : depth === 1 ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
          }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)'; }}
          onMouseOut={e => { e.currentTarget.style.background = depth === 0 ? 'rgba(139, 92, 246, 0.08)' : depth === 1 ? 'rgba(6, 182, 212, 0.05)' : 'transparent'; e.currentTarget.style.borderColor = depth === 0 ? 'rgba(139, 92, 246, 0.2)' : depth === 1 ? 'rgba(6, 182, 212, 0.15)' : 'transparent'; }}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown size={14} style={{ color: 'var(--accent-cyan)' }} /> : <ChevronRight size={14} style={{ color: 'var(--text-dim)' }} />
          ) : (
            <div style={{ width: 14 }} />
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{
              fontWeight: depth <= 1 ? 700 : 500, fontSize: depth === 0 ? '15px' : '13px', color: 'var(--text-main)'
            }}>
              {node.name}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{node.role}</span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600,
              background: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6'
            }}>
              {node.count}
            </span>
          </div>
        </div>
        {isExpanded && hasChildren && (
          <div>
            {node.children!.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Search & Stats */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder={isRtl ? 'بحث عن قسم أو دور...' : 'Search department or role...'}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              color: 'var(--text-main)', padding: '8px 12px 8px 32px', borderRadius: '8px',
              fontSize: '13px', width: '250px'
            }}
          />
        </div>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          <Users size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
          {data.length} {isRtl ? 'موظف في' : 'employees in'} {deptStats.length} {isRtl ? 'قسم' : 'departments'}
        </span>
      </div>

      {/* Department Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {deptStats.map(([dept, count]) => (
          <div key={dept} className="glass-panel-noclick" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={16} style={{ color: 'var(--accent-cyan)' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-main)' }}>{dept}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{count} {isRtl ? 'موظف' : 'staff'} • {((count / data.length) * 100).toFixed(0)}%</div>
              </div>
            </div>
            <div style={{ height: '4px', borderRadius: '2px', background: 'var(--border-color)', marginTop: '10px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(count / data.length) * 100}%`, background: 'var(--gradient-primary)', borderRadius: '2px' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Org Tree */}
      <div className="glass-panel-noclick" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
          {isRtl ? 'الهيكل التنظيمي' : 'Organization Structure'}
        </h3>
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {renderNode(tree, 0)}
        </div>
      </div>
    </div>
  );
};

export default OrgChart;