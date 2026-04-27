import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      return setError('Passwords do not match.');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['🎓 Take a career quiz', '📊 Get personalized results', '💼 Explore jobs & colleges'];

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 style={styles.brand}>Join Pathfinder</h1>
          <p style={styles.brandSub}>Start your career discovery journey today</p>
          <div style={styles.stepsWrap}>
            {steps.map((s, i) => (
              <div key={i} style={{ ...styles.stepItem, animationDelay: `${i * 0.15}s` }}>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={styles.decorCircle1} />
        <div style={styles.decorCircle2} />
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.formCard} className="glass fade-up">
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Create account</h2>
            <p style={styles.formSub}>Fill in your details to get started</p>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" placeholder="Your full name"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="Min. 6 characters"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-input" placeholder="Repeat your password"
                value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: '4px' }}>
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <p style={styles.switchText}>
            Already have an account?{' '}
            <Link to="/login" style={styles.switchLink}>Sign in</Link>
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
    background: 'linear-gradient(135deg, #0f0c29 0%, #1e1b4b 50%, #312e81 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '60px',
    position: 'relative',
    overflow: 'hidden',
  },
  brand: {
    fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: 800,
    background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    letterSpacing: '-0.04em', marginBottom: '12px',
  },
  brandSub: { color: 'rgba(240,240,255,0.6)', fontSize: '1rem' },
  stepsWrap: { marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '16px' },
  stepItem: {
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '14px 24px',
    fontSize: '0.95rem',
    fontFamily: 'var(--font-heading)',
    fontWeight: 500,
    animation: 'fadeUp 0.5s ease forwards',
    opacity: 0,
  },
  decorCircle1: {
    position: 'absolute', top: '-80px', right: '-80px',
    width: '350px', height: '350px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)',
  },
  decorCircle2: {
    position: 'absolute', bottom: '-60px', left: '-60px',
    width: '280px', height: '280px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)',
  },
  rightPanel: {
    width: '480px', minWidth: '380px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px 60px',
    background: 'rgba(8,8,24,0.6)',
  },
  formCard: { width: '100%', padding: '40px', borderRadius: '24px' },
  formHeader: { marginBottom: '28px' },
  formTitle: { fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.03em' },
  formSub: { color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.95rem' },
  switchText: { textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '24px' },
  switchLink: { color: 'var(--accent)', fontWeight: 600 },
};

export default Register;
