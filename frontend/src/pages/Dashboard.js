import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import API from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await API.get('/analysis/history');
        setHistory(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const careerIcons = {
    'Software Developer': '💻',
    'UI/UX Designer': '🎨',
    'Business Manager': '📊',
  };

  const stats = [
    { label: 'Quizzes Taken', value: history.length, icon: '📝', color: 'var(--grad-1)' },
    { label: 'Career Insights', value: history.length > 0 ? '1' : '0', icon: '🎯', color: 'var(--grad-3)' },
    { label: 'Jobs Available', value: '10+', icon: '💼', color: 'var(--grad-4)' },
    { label: 'Colleges Listed', value: '10+', icon: '🏛️', color: 'var(--grad-5)' },
  ];

  return (
    <div className="page">
      {/* Hero */}
      <div style={styles.hero} className="glass fade-up">
        <div>
          <h1 style={styles.heroTitle}>
            Hello, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={styles.heroSub}>
            Ready to discover your ideal career path? Take a quiz and get personalized recommendations.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
            <Link to="/quiz" className="btn btn-primary btn-lg">
              🚀 Take Career Quiz
            </Link>
            {history.length > 0 && (
              <button className="btn btn-secondary btn-lg" onClick={() => navigate(`/result/${history[0]._id}`)}>
                View Latest Result
              </button>
            )}
          </div>
        </div>
        <div style={styles.heroOrb} />
      </div>

      {/* Stats */}
      <div className="grid grid-4" style={{ margin: '32px 0' }}>
        {stats.map((s, i) => (
          <div key={i} className="glass" style={{ ...styles.statCard, animationDelay: `${i * 0.1}s` }}>
            <div style={{ ...styles.statIcon, background: s.color }}>{s.icon}</div>
            <div style={styles.statValue}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 style={styles.sectionTitle}>Explore</h2>
      <div className="grid grid-3" style={{ marginBottom: '40px' }}>
        {[
          { icon: '🧠', title: 'Career Quiz', desc: 'Answer 10 questions and discover your ideal career path based on your strengths.', action: () => navigate('/quiz'), btn: 'Start Quiz', color: '#7c6fff' },
          { icon: '💼', title: 'Browse Jobs', desc: 'Explore career opportunities tailored to your skills and interests.', action: () => navigate('/jobs'), btn: 'View Jobs', color: '#f5576c' },
          { icon: '🏛️', title: 'Find Colleges', desc: 'Discover top institutes for your chosen career in India and beyond.', action: () => navigate('/colleges'), btn: 'Explore', color: '#00f2fe' },
        ].map((card, i) => (
          <div key={i} className="glass" style={styles.actionCard}>
            <div style={{ ...styles.actionIcon, color: card.color }}>{card.icon}</div>
            <h3 style={styles.actionTitle}>{card.title}</h3>
            <p style={styles.actionDesc}>{card.desc}</p>
            <button className="btn btn-secondary" onClick={card.action} style={{ marginTop: 'auto' }}>
              {card.btn} →
            </button>
          </div>
        ))}
      </div>

      {/* History */}
      <h2 style={styles.sectionTitle}>Your Quiz History</h2>
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : history.length === 0 ? (
        <div className="glass" style={styles.emptyState}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🗺️</div>
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>No quiz results yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Take your first quiz to discover your ideal career path!</p>
          <Link to="/quiz" className="btn btn-primary">Take Quiz Now</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {history.map((item) => (
            <div key={item._id} className="glass" style={styles.historyItem}>
              <div style={styles.historyIcon}>
                {careerIcons[item.result?.career] || '🎯'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={styles.historyCareer}>{item.result?.career}</div>
                <div style={styles.historyMeta}>
                  <span className="badge badge-purple">{item.quizType} quiz</span>
                  <span style={styles.historyDate}>
                    {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/result/${item._id}`)}>
                View Result →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  hero: {
    padding: '48px',
    borderRadius: '24px',
    background: 'linear-gradient(135deg, rgba(124,111,255,0.12) 0%, rgba(245,87,108,0.06) 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  heroTitle: { fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em' },
  heroSub: { color: 'var(--text-secondary)', marginTop: '10px', fontSize: '1rem', maxWidth: '520px' },
  heroOrb: {
    position: 'absolute', right: '-60px', top: '-60px',
    width: '300px', height: '300px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,111,255,0.2) 0%, transparent 70%)',
  },
  statCard: {
    padding: '28px 24px',
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px',
    animation: 'fadeUp 0.5s ease forwards', opacity: 0,
  },
  statIcon: {
    width: '44px', height: '44px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.3rem', marginBottom: '4px',
  },
  statValue: { fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800 },
  statLabel: { color: 'var(--text-secondary)', fontSize: '0.82rem' },
  sectionTitle: { fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '20px' },
  actionCard: { padding: '32px', display: 'flex', flexDirection: 'column', gap: '12px' },
  actionIcon: { fontSize: '2.4rem' },
  actionTitle: { fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700 },
  actionDesc: { color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6', flex: 1 },
  emptyState: { padding: '60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  historyItem: {
    padding: '20px 24px',
    display: 'flex', alignItems: 'center', gap: '20px',
  },
  historyIcon: { fontSize: '2.2rem', width: '50px', textAlign: 'center' },
  historyCareer: { fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', marginBottom: '8px' },
  historyMeta: { display: 'flex', alignItems: 'center', gap: '12px' },
  historyDate: { color: 'var(--text-muted)', fontSize: '0.8rem' },
};

export default Dashboard;
