import React from 'react';
import type { ReactNode, CSSProperties } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  colorClass?: string;
  glowing?: boolean;
  id?: string;
  style?: CSSProperties;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  colorClass = '',
  glowing = false,
  id,
  style = {}
}) => {
  return (
    <div 
      id={id}
      className={`glass-panel-noclick ${glowing ? 'glowing-element' : ''}`}
      style={{
        ...style,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>{title}</span>
        <div style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center' }}>
          {icon}
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span 
          className={colorClass} 
          style={{ 
            fontSize: '28px', 
            fontWeight: 800, 
            letterSpacing: '-0.03em',
            fontFamily: 'var(--font-family)'
          }}
        >
          {value}
        </span>
        {subtitle && (
          <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 400 }}>
            {subtitle}
          </span>
        )}
      </div>

      {/* Decorative background circle */}
      <div 
        style={{
          position: 'absolute',
          bottom: '-20px',
          right: '-20px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};
