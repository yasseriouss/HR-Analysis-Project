import React from 'react';
import { 
  Users, 
  UserX, 
  CircleDollarSign, 
  HeartHandshake, 
  Sparkles, 
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Database
} from 'lucide-react';
import { t } from '../utils/i18n';
import type { Language } from '../utils/i18n';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  lang: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  lang
}) => {
  const isRtl = lang === 'ar';

  const menuItems = [
    { id: 'overview', labelKey: 'tabOverview' as const, icon: <Users size={20} /> },
    { id: 'attrition', labelKey: 'tabAttrition' as const, icon: <UserX size={20} /> },
    { id: 'salary', labelKey: 'tabSalary' as const, icon: <CircleDollarSign size={20} /> },
    { id: 'satisfaction', labelKey: 'tabSatisfaction' as const, icon: <HeartHandshake size={20} /> },
    { id: 'performance', labelKey: 'tabPerformance' as const, icon: <Sparkles size={20} /> },
    { id: 'predictor', labelKey: 'tabPredictor' as const, icon: <BrainCircuit size={20} />, highlight: true },
    { id: 'dataentry', labelKey: 'tabDataEntry' as const, icon: <Database size={20} /> },
  ];

  return (
    <aside
      id="sidebar-navigation"
      style={{
        width: isCollapsed ? '70px' : '260px',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: isRtl ? 'none' : '1px solid var(--border-color)',
        borderLeft: isRtl ? '1px solid var(--border-color)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 100,
        overflowX: 'hidden'
      }}
    >
      {/* Brand Header */}
      <div 
        style={{
          padding: '24px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid var(--border-color)',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}
      >
        <div 
          style={{
            background: 'var(--gradient-primary)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            flexShrink: 0
          }}
        >
          <BrainCircuit size={24} />
        </div>
        {!isCollapsed && (
          <span 
            style={{ 
              fontWeight: 800, 
              fontSize: '18px', 
              fontFamily: isRtl ? 'Tajawal, sans-serif' : 'Outfit, sans-serif',
              letterSpacing: '-0.02em'
            }}
          >
            {isRtl ? (
              <>
                نبض <span className="gradient-text">الموظفين</span>
              </>
            ) : (
              <>
                HR <span className="gradient-text">Pulse</span>
              </>
            )}
          </span>
        )}
      </div>

      {/* Navigation List */}
      <nav 
        style={{
          padding: '20px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flex: 1
        }}
      >
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const label = t(item.labelKey, lang);
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontFamily: isRtl ? 'Tajawal, sans-serif' : 'var(--font-family)',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                textAlign: isRtl ? 'right' : 'left',
                width: '100%',
                transition: 'all 0.2s ease',
                backgroundColor: isActive 
                  ? 'hsla(263, 90%, 65%, 0.15)' 
                  : 'transparent',
                color: isActive 
                  ? 'var(--text-main)' 
                  : 'var(--text-muted)',
                borderLeft: isRtl ? 'none' : (isActive ? '3px solid var(--accent-purple)' : '3px solid transparent'),
                borderRight: isRtl ? (isActive ? '3px solid var(--accent-purple)' : '3px solid transparent') : 'none',
                position: 'relative',
                boxShadow: isActive ? 'inset 0 0 10px rgba(185, 90%, 50%, 0.05)' : 'none'
              }}
              className={item.highlight && !isActive ? 'glowing-element' : ''}
              title={isCollapsed ? label : undefined}
            >
              <span 
                style={{ 
                  color: isActive 
                    ? 'var(--accent-cyan)' 
                    : (item.highlight ? 'var(--accent-purple)' : 'inherit'),
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {item.icon}
              </span>
              {!isCollapsed && (
                <span style={{ whiteSpace: 'nowrap' }}>
                  {label}
                </span>
              )}
              {item.highlight && !isCollapsed && (
                <span 
                  style={{
                    marginRight: isRtl ? 'auto' : '0',
                    marginLeft: isRtl ? '0' : 'auto',
                    backgroundColor: 'var(--accent-purple)',
                    color: 'white',
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}
                >
                  {t('tabPredictorBadge', lang)}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle Footer */}
      <div 
        style={{
          padding: '16px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: isCollapsed ? 'center' : (isRtl ? 'flex-start' : 'flex-end')
        }}
      >
        <button
          id="sidebar-collapse-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title={isCollapsed ? (isRtl ? 'توسيع القائمة' : 'Expand Sidebar') : (isRtl ? 'طي القائمة' : 'Collapse Sidebar')}
        >
          {isCollapsed 
            ? (isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />) 
            : (isRtl ? <ChevronRight size={16} /> : <ChevronLeft size={16} />)
          }
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
