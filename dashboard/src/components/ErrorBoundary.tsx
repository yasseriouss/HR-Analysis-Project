import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { t } from '../utils/i18n';
import type { Language } from '../utils/i18n';

interface ErrorBoundaryProps {
  children: ReactNode;
  lang: Language;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      const lang = this.props.lang;
      const isRtl = lang === 'ar';
      return (
        <div className="glass-panel-noclick" style={{ padding: '40px', textAlign: 'center', marginTop: '16px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--color-warning)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('errorTitle', lang)}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-dim)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
            {t('errorSubtitle', lang)}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}