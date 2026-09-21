import React from 'react';
import { reportError } from '../utils/telemetry';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    reportError(error, { componentStack: info?.componentStack || '' });
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#f7f7f5', color: '#151719' }}>
        <section style={{ width: '100%', maxWidth: 560, background: '#fff', border: '1px solid #e0e2e4', borderRadius: 14, padding: 32, boxShadow: '0 18px 50px rgba(17,19,21,.08)' }}>
          <p style={{ margin: 0, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: '#087cb8', fontWeight: 700 }}>Resummetry</p>
          <h1 style={{ fontSize: 34, lineHeight: 1.05, margin: '12px 0' }}>Something went wrong.</h1>
          <p style={{ color: '#626870', lineHeight: 1.6, marginBottom: 24 }}>Your work should still be safe. Refresh the page and continue where you left off.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => window.location.reload()} style={{ border: 0, borderRadius: 8, padding: '12px 16px', background: '#151719', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Refresh</button>
            <a href="/dashboard" style={{ border: '1px solid #dfe2e4', borderRadius: 8, padding: '11px 16px', color: '#151719', textDecoration: 'none', fontWeight: 700 }}>Back to dashboard</a>
          </div>
        </section>
      </main>
    );
  }
}

export default AppErrorBoundary;
