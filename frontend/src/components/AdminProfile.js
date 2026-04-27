import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import API from '../utils/api';

const AdminProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // ✅ FORM STATE
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // ✅ UPDATE PROFILE
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!formData.name.trim()) {
      setMessage('⚠️ Name is required');
      return;
    }

    if (!formData.email.trim()) {
      setMessage('⚠️ Email is required');
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.put('/admin/profile', {
        name: formData.name,
        email: formData.email
      });
      setMessage('✅ Profile updated successfully!');
      localStorage.setItem('user', JSON.stringify(data.data));
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Update error:', error);
      setMessage(`❌ ${error.response?.data?.message || 'Failed to update'}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATE PASSWORD
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!passwordData.currentPassword) {
      setMessage('⚠️ Current password is required');
      return;
    }

    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      setMessage('⚠️ New password must be at least 6 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('⚠️ Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await API.put('/admin/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage('✅ Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Password update error:', error);
      setMessage(`❌ ${error.response?.data?.message || 'Failed to update password'}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE ACCOUNT
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This action cannot be undone!')) {
      return;
    }

    try {
      setLoading(true);
      await API.delete('/admin/profile');
      setMessage('✅ Account deleted');
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error('Delete error:', error);
      setMessage(`❌ ${error.response?.data?.message || 'Failed to delete account'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (user.role !== 'admin') {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="page" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* ════════════════════════════════════════════════════════════════ */}
      {/* HEADER */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div className="glass fade-up" style={styles.headerCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={styles.avatar}>
            {user.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '1.8rem', fontWeight: 800 }}>
              {user.name}
            </h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {user.email}
            </p>
            <span className="badge badge-purple" style={{ marginTop: '8px' }}>
              👨‍💼 {user.role.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* TABS */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div style={styles.tabBar}>
        <button
          style={{ ...styles.tabBtn, ...(tab === 'profile' ? styles.tabActive : {}) }}
          onClick={() => setTab('profile')}
        >
          ⚙️ Settings
        </button>
        <button
          style={{ ...styles.tabBtn, ...(tab === 'password' ? styles.tabActive : {}) }}
          onClick={() => setTab('password')}
        >
          🔐 Password
        </button>
        <button
          style={{ ...styles.tabBtn, ...(tab === 'stats' ? styles.tabActive : {}) }}
          onClick={() => setTab('stats')}
        >
          📈 Statistics
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* MESSAGE */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {message && (
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px',
          background: message.includes('✅') ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)',
          border: `1px solid ${message.includes('✅') ? '#4caf50' : '#f44336'}`,
          color: message.includes('✅') ? '#2e7d32' : '#c62828'
        }}>
          {message}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* TAB: PROFILE SETTINGS */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {tab === 'profile' && (
        <div className="glass fade-up" style={styles.formCard}>
          <h2 style={styles.formTitle}>Profile Settings</h2>

          <form onSubmit={handleUpdateProfile}>
            {/* Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                style={styles.input}
              />
            </div>

            {/* Email */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                style={styles.input}
              />
            </div>

            {/* Admin ID / Read-only */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Admin ID</label>
              <input
                type="text"
                value={user._id || user.id}
                disabled
                style={{ ...styles.input, background: 'var(--bg-card)', cursor: 'not-allowed' }}
              />
              <small style={{ color: 'var(--text-secondary)' }}>Auto-generated ID (read-only)</small>
            </div>

            {/* Role - Read only */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Role</label>
              <input
                type="text"
                value="Administrator"
                disabled
                style={{ ...styles.input, background: 'var(--bg-card)', cursor: 'not-allowed' }}
              />
              <small style={{ color: 'var(--text-secondary)' }}>Admin privileges (read-only)</small>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '24px' }}
            >
              {loading ? '⏳ Saving...' : '💾 Update Profile'}
            </button>
          </form>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* TAB: PASSWORD */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {tab === 'password' && (
        <div className="glass fade-up" style={styles.formCard}>
          <h2 style={styles.formTitle}>Change Password</h2>

          <form onSubmit={handleUpdatePassword}>
            {/* Current Password */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter current password"
                style={styles.input}
              />
            </div>

            {/* New Password */}
            <div style={styles.formGroup}>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Enter new password (min 6 characters)"
                style={styles.input}
              />
            </div>

            {/* Confirm Password */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                style={styles.input}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '24px' }}
            >
              {loading ? '⏳ Updating...' : '🔐 Update Password'}
            </button>
          </form>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* TAB: STATISTICS */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {tab === 'stats' && (
        <div className="glass fade-up" style={styles.formCard}>
          <h2 style={styles.formTitle}>Admin Statistics</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            View detailed statistics from your admin dashboard.
          </p>
          <Link to="/admin" className="btn btn-primary">
            → Go to Admin Dashboard
          </Link>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* DANGER ZONE */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div className="glass fade-up" style={{
        padding: '28px',
        marginTop: '40px',
        background: 'rgba(244,67,54,0.05)',
        border: '1px solid rgba(244,67,54,0.2)',
        borderRadius: '16px'
      }}>
        <h3 style={{ marginBottom: '16px', fontWeight: 700, color: '#c62828' }}>
          ⚠️ Danger Zone
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Permanently delete your admin account and all associated data.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={loading}
          className="btn btn-danger"
          style={{ width: '100%' }}
        >
          {loading ? '⏳ Processing...' : '🗑️ Delete Account'}
        </button>
      </div>

      {/* Back to Admin */}
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <Link to="/admin" className="btn btn-secondary">
          ← Back to Admin Dashboard
        </Link>
      </div>
    </div>
  );
};

const styles = {
  headerCard: {
    padding: '32px',
    marginBottom: '32px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(124,111,255,0.1), rgba(67,233,123,0.05))',
    border: '1px solid rgba(124,111,255,0.2)'
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '16px',
    background: 'var(--grad-1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 700,
    color: '#fff',
    flexShrink: 0
  },
  tabBar: {
    display: 'flex',
    gap: '8px',
    marginBottom: '28px',
    background: 'var(--bg-card)',
    padding: '8px',
    borderRadius: '12px',
    width: 'fit-content'
  },
  tabBtn: {
    padding: '10px 20px',
    borderRadius: '9px',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'capitalize'
  },
  tabActive: {
    background: 'rgba(124,111,255,0.2)',
    color: 'var(--text-primary)'
  },
  formCard: {
    padding: '32px',
    marginBottom: '32px',
    borderRadius: '16px'
  },
  formTitle: {
    marginBottom: '24px',
    fontSize: '1.3rem',
    fontWeight: 700
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 600,
    fontSize: '0.9rem'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '1rem',
    background: 'transparent',
    color: 'var(--text-primary)'
  }
};

export default AdminProfile;