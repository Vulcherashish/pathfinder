import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <div style={styles.brandWrap}>
          <h1 style={styles.brand}>Pathfinder</h1>
          <p style={styles.brandSub}>Your AI-powered career compass</p>
        </div>
        <div style={styles.decorCircle1} />
        <div style={styles.decorCircle2} />
        <div style={styles.floatingCard}>
          <div style={styles.floatIcon}>🎯</div>
          <div>
            <div style={styles.floatTitle}>Find Your Path</div>
            <div style={styles.floatText}>Take a quiz, discover your career</div>
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.formCard} className="glass fade-up">
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Welcome back</h2>
            <p style={styles.formSub}>Sign in to continue your journey</p>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: '8px' }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form><br></br>

          <p style={styles.switchText}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.switchLink}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { display: 'flex', minHeight: '100vh' },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '60px',
    position: 'relative',
    overflow: 'hidden',
  },
  brandWrap: { textAlign: 'center', zIndex: 1, position: 'relative' },
  brand: {
    fontFamily: 'var(--font-heading)',
    fontSize: '4rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #667eea, #a78bfa, #f0abfc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text', 
    letterSpacing: '-0.04em',
    marginBottom: '12px',
  },
  brandSub: { color: 'rgba(240,240,255,0.6)', fontSize: '1.1rem', fontFamily: 'var(--font-body)' },
  decorCircle1: {
    position: 'absolute', top: '-100px', right: '-100px',
    width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,111,255,0.15) 0%, transparent 70%)',
  },
  decorCircle2: {
    position: 'absolute', bottom: '-80px', left: '-80px',
    width: '300px', height: '300px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(245,87,108,0.12) 0%, transparent 70%)',
  },
  floatingCard: {
    position: 'absolute', bottom: '60px', left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    whiteSpace: 'nowrap',
    animation: 'float 3s ease-in-out infinite',
  },
  floatIcon: { fontSize: '2rem' },
  floatTitle: { fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem' },
  floatText: { color: 'rgba(240,240,255,0.5)', fontSize: '0.8rem', marginTop: '2px' },
  rightPanel: {
    width: '480px', minWidth: '380px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 60px',
    background: 'rgba(8,8,24,0.6)',
  },
  formCard: { width: '100%', padding: '40px', borderRadius: '24px' },
  formHeader: { marginBottom: '32px' },
  formTitle: { fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em' },
  formSub: { color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.95rem' },
  divider: {
    display: 'flex', alignItems: 'center', gap: '12px',
    margin: '24px 0',
    color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em',
  },
  demoBox: {
    background: 'rgba(124,111,255,0.06)',
    border: '1px solid rgba(124,111,255,0.15)',
    borderRadius: '10px',
    padding: '12px 16px',
    marginBottom: '24px',
  },
  demoItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  demoLabel: { fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent)', fontFamily: 'var(--font-heading)', fontWeight: 700 },
  demoVal: { fontSize: '0.82rem', color: 'var(--text-secondary)', fontFamily: 'monospace' },
  switchText: { textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' },
  switchLink: { color: 'var(--accent)', fontWeight: 600 },
};

export default Login;
