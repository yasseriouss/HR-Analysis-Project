import React, { useState } from 'react';
import { useTheme } from '../utils/theme';
import { PaintBucket, Check, X } from 'lucide-react';
import type { Language } from '../utils/i18n';

interface ThemeSelectorProps { lang: Language; }

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ lang }) => {
  const { currentTheme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const isRtl = lang === 'ar';

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={isRtl ? 'تغيير الثيم' : 'Change Theme'}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'var(--bg-card)', border: '1px solid var(--border-color)',
          color: 'var(--text-main)', padding: '8px 12px', borderRadius: '20px',
          cursor: 'pointer', fontSize: '12px', fontWeight: 600,
          transition: 'all 0.2s ease',
        }}
        onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent-purple)'; }}
        onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
      >
        <PaintBucket size={14} style={{ color: 'var(--accent-cyan)' }} />
        <span>{isRtl ? 'ثيم' : 'Theme'}</span>
        <span style={{
          width: '12px', height: '12px', borderRadius: '50%',
          background: currentTheme.preview, border: '2px solid var(--accent-cyan)'
        }} />
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}
          />
          <div style={{
            position: 'absolute', top: '44px', right: isRtl ? 'auto' : '0', left: isRtl ? '0' : 'auto',
            background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            borderRadius: '12px', padding: '12px', zIndex: 10000,
            boxShadow: 'var(--shadow-main)', backdropFilter: 'blur(20px)',
            minWidth: '260px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                {isRtl ? 'اختر الثيم' : 'Choose Theme'}
              </span>
              <button onClick={() => setIsOpen(false)} style={{
                background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer'
              }}>
                <X size={14} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => { setTheme(theme.id); setIsOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: '8px',
                    border: theme.id === currentTheme.id ? '2px solid var(--accent-cyan)' : '1px solid transparent',
                    background: theme.id === currentTheme.id ? 'rgba(6,182,212,0.08)' : 'transparent',
                    cursor: 'pointer', transition: 'all 0.15s ease',
                  }}
                  onMouseOver={e => { if (theme.id !== currentTheme.id) e.currentTarget.style.background = 'rgba(139,92,246,0.05)'; }}
                  onMouseOut={e => { if (theme.id !== currentTheme.id) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: theme.preview, flexShrink: 0,
                    border: '2px solid var(--border-color)'
                  }} />
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                      {isRtl ? theme.name.ar : theme.name.en}
                    </div>
                  </div>
                  {theme.id === currentTheme.id && (
                    <Check size={14} style={{ color: 'var(--accent-cyan)' }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;