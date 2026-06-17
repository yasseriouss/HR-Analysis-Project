import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './utils/theme'
import './index.css'

// Lazy load App for better initial load performance
const App = lazy(() => import('./App.tsx'));

// Loading screen shown while App loads
const AppLoader: React.FC = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    height: '100vh', background: 'var(--bg-main)', color: 'var(--text-muted)', gap: '16px'
  }}>
    <div style={{
      width: '48px', height: '48px', borderRadius: '12px',
      background: 'var(--gradient-primary)', animation: 'pulseGlow 2s infinite',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <span style={{ color: 'white', fontSize: '20px', fontWeight: 800 }}>HR</span>
    </div>
    <span style={{ fontSize: '14px', fontWeight: 600 }}>
      HR Pulse Dashboard
    </span>
    <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)',
          animation: `fadeIn 0.5s ${i * 0.15}s ease infinite alternate`,
        }} />
      ))}
    </div>
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Suspense fallback={<AppLoader />}>
        <App />
      </Suspense>
    </ThemeProvider>
  </StrictMode>,
);