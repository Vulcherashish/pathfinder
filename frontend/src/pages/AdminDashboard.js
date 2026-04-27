import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend,
} from 'chart.js';
import API from '../utils/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/admin/stats');
        setStats(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="page"><div className="spinner-wrap"><div className="spinner" /></div></div>;

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: '#7c6fff', grad: 'var(--grad-1)' },
    { label: 'Total Jobs', value: stats?.totalJobs || 0, icon: '💼', color: '#f5576c', grad: 'var(--grad-2)' },
    { label: 'Total Colleges', value: stats?.totalColleges || 0, icon: '🏛️', color: '#43e97b', grad: 'var(--grad-4)' },
    { label: 'Quizzes Taken', value: stats?.totalAnalysis || 0, icon: '📝', color: '#00f2fe', grad: 'var(--grad-3)' },
  ];

  const careerDist = stats?.careerDistribution || [];
  const doughnutData = {
    labels: careerDist.map(c => c._id || 'Unknown'),
    datasets: [{
      data: careerDist.map(c => c.count),
      backgroundColor: ['rgba(124,111,255,0.8)', 'rgba(245,87,108,0.8)', 'rgba(67,233,123,0.8)', 'rgba(0,242,254,0.8)'],
      borderColor: ['#7c6fff', '#f5576c', '#43e97b', '#00f2fe'],
      borderWidth: 2,
    }]
  };

  const recentAnalysis = stats?.recentAnalysis || [];
  const barData = {
    labels: recentAnalysis.map((_, i) => `Result ${i + 1}`),
    datasets: [{
      label: 'Quiz Submissions',
      data: recentAnalysis.map(() => Math.floor(Math.random() * 5) + 1),
      backgroundColor: 'rgba(124,111,255,0.7)',
      borderRadius: 8,
      borderSkipped: false,
    }]
  };

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#f0f0ff', font: { family: 'DM Sans', size: 11 } } },
      tooltip: { backgroundColor: 'rgba(8,8,24,0.9)', titleColor: '#f0f0ff', bodyColor: 'rgba(240,240,255,0.7)', borderColor: 'rgba(124,111,255,0.3)', borderWidth: 1 }
    },
    scales: {
      x: { ticks: { color: 'rgba(240,240,255,0.6)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: 'rgba(240,240,255,0.6)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    }
  };

  const quickLinks = [
    { label: 'Manage Jobs', to: '/admin/jobs', icon: '💼', desc: 'Add, edit, delete job listings' },
    { label: 'Manage Colleges', to: '/admin/colleges', icon: '🏛️', desc: 'Add, edit, delete colleges' },
    { label: 'View Users', to: '/admin/users', icon: '👥', desc: 'See all registered users' },
    { label: 'Manage Quiz', to: '/admin/quiz', icon: '📝', desc: 'Add, edit, delete quiz questions' },
  ];

  return (
    <div className="page">
      <div className="page-header fade-up">
        <h1 className="page-title">⚡ Admin Dashboard</h1>
        <p className="page-subtitle">Pathfinder system overview and management</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-4" style={{ marginBottom: '32px' }}>
        {statCards.map((s, i) => (
          <div key={i} className="glass" style={{ ...styles.statCard, animationDelay: `${i * 0.08}s` }}>
            <div style={{ ...styles.statIconWrap, background: s.grad }}>{s.icon}</div>
            <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-3" style={{ marginBottom: '32px' }}>
        {quickLinks.map((ql, i) => (
          <Link key={i} to={ql.to} style={{ textDecoration: 'none' }}>
            <div className="glass" style={styles.quickCard}>
              <span style={{ fontSize: '2rem' }}>{ql.icon}</span>
              <div>
                <div style={styles.quickTitle}>{ql.label}</div>
                <div style={styles.quickDesc}>{ql.desc}</div>
              </div>
              <span style={{ color: 'var(--accent)', marginLeft: 'auto' }}>→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-2" style={{ gap: '24px', marginBottom: '32px' }}>
        {careerDist.length > 0 && (
          <div className="glass" style={styles.chartBox}>
            <h3 style={styles.chartTitle}>Career Distribution</h3>
            <div style={{ height: '260px' }}>
              <Doughnut data={doughnutData} options={{ ...chartOpts, scales: undefined }} />
            </div>
          </div>
        )}
        <div className="glass" style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Recent Activity</h3>
          <div style={{ height: '260px' }}>
            <Bar data={barData} options={chartOpts} />
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="glass" style={styles.tableBox}>
        <div style={styles.tableHeader}>
          <h3 style={styles.chartTitle}>Recent Users</h3>
          <Link to="/admin/users" className="btn btn-secondary btn-sm">View All →</Link>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
              {['Name', 'Email', 'Role', 'Joined'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(stats?.recentUsers || []).map(u => (
              <tr key={u._id} style={styles.tr}>
                <td style={styles.td}>{u.name}</td>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}>
                  <span className={`badge ${u.role === 'admin' ? 'badge-pink' : 'badge-purple'}`}>{u.role}</span>
                </td>
                <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(stats?.recentUsers || []).length === 0 && (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>No users yet</div>
        )}
      </div>

      {/* Recent Quiz Results */}
      {recentAnalysis.length > 0 && (
        <div className="glass" style={{ ...styles.tableBox, marginTop: '24px' }}>
          <div style={styles.tableHeader}>
            <h3 style={styles.chartTitle}>Recent Quiz Results</h3>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                {['User', 'Career Matched', 'Quiz Type', 'Date'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentAnalysis.map(a => (
                <tr key={a._id} style={styles.tr}>
                  <td style={styles.td}>{a.userId?.name || '—'}</td>
                  <td style={styles.td}>{a.result?.career || '—'}</td>
                  <td style={styles.td}>
                    <span className="badge badge-cyan">{a.quizType}</span>
                  </td>
                  <td style={styles.td}>{new Date(a.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  statCard: {
    padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '10px',
    animation: 'fadeUp 0.4s ease forwards', opacity: 0,
  },
  statIconWrap: {
    width: '48px', height: '48px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
  },
  statValue: { fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 },
  statLabel: { color: 'var(--text-secondary)', fontSize: '0.82rem' },
  quickCard: {
    padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px',
    cursor: 'pointer', borderRadius: '16px',
  },
  quickTitle: { fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem' },
  quickDesc: { color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' },
  chartBox: { padding: '28px' },
  chartTitle: { fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '20px', fontSize: '1rem' },
  tableBox: { padding: '28px', borderRadius: '16px', overflowX: 'auto' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left', padding: '10px 16px',
    fontFamily: 'var(--font-heading)', fontSize: '0.72rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)',
    borderBottom: '1px solid var(--border)',
  },
  tr: { transition: 'background 0.2s' },
  td: { padding: '14px 16px', fontSize: '0.88rem', borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'var(--text-secondary)' },
};

export default AdminDashboard;
