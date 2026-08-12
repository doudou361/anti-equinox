import React from 'react';

/**
 * Catches render/lifecycle errors so a thrown component does not leave the
 * visitor staring at a blank page with the reason buried in the console.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error:', error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        role="alert"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '2rem',
          textAlign: 'center',
          background: '#070709',
          color: '#F4F4F5',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#C5A059' }}>
          Une erreur est survenue
        </h1>
        <p style={{ margin: 0, color: '#9A948A', maxWidth: '480px', lineHeight: 1.6 }}>
          La page n'a pas pu s'afficher correctement. Rechargez la page, ou
          contactez-nous au{' '}
          <a href="tel:0562838455" style={{ color: '#C5A059' }}>0562 83 84 55</a>.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '50px',
            border: 'none',
            background: '#C5A059',
            color: '#0A0A0A',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Recharger la page
        </button>
        <pre
          style={{
            maxWidth: '90vw',
            overflowX: 'auto',
            fontSize: '12px',
            color: '#6b675f',
            margin: 0,
          }}
        >
          {this.state.error.message}
        </pre>
      </div>
    );
  }
}

export default ErrorBoundary;
