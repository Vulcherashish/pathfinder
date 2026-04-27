import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={styles.page}>
    <div style={styles.code}>404</div>
    <h1 style={styles.title}>Page Not Found</h1>
    <p style={styles.sub}>The page you're looking for doesn't exist or has been moved.</p>
    <Link to="/" className="btn btn-primary btn-lg" style={{ marginTop: '32px' }}>
      ← Back to Home
    </Link>
  </div>
);

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', padding: '40px',
  },
  code: {
    fontFamily: 'var(--font-heading)',
    fontSize: '8rem', fontWeight: 800, lineHeight: 1,
    background: 'linear-gradient(135deg, #667eea, #f5576c)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    marginBottom: '16px',
  },
  title: { fontSize: '2rem', fontWeight: 700, marginBottom: '12px' },
  sub: { color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '400px' },
};

export default NotFound;
