import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const notify = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This is irreversible.')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      notify('User deleted.');
      fetchUsers();
    } catch {
      notify('Delete failed.', 'error');
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalAdmins = users.filter(u => u.role === 'admin').length;
  const totalUsers = users.filter(u => u.role === 'user').length;

  return (
    <div className="page">
      <div style={styles.header}>
        <div>
          <h1 className="page-title">👥 All Users</h1>
          <p className="page-subtitle">{users.length} total — {totalAdmins} admin, {totalUsers} users</p>
        </div>
      </div>

      {msg.text && <div className={`alert alert-${msg.type}`}>{msg.type === 'success' ? '✓' : '⚠️'} {msg.text}</div>}

      <div className="glass" style={styles.filterBar}>
        <input
          className="form-input"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '360px' }}
        />
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : (
        <div className="glass" style={{ overflowX: 'auto', borderRadius: '16px' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user._id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.userAvatar}>
                      <div style={{ ...styles.avatar, background: user.role === 'admin' ? 'rgba(245,87,108,0.2)' : 'rgba(124,111,255,0.2)' }}>
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
                    <span className={`badge ${user.role === 'admin' ? 'badge-pink' : 'badge-purple'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {new Date(user.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </td>
                  <td style={styles.td}>
                    {user.role !== 'admin' ? (
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)}>
                        Delete
                      </button>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              {search ? `No users matching "${search}"` : 'No users found.'}
            </div>
          )}
        </div>
      )}

      <div className="glass" style={styles.summaryBox}>
        <div style={styles.summaryItem}>
          <span style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#7c6fff' }}>{totalUsers}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Regular Users</span>
        </div>
        <div style={styles.divider} />
        <div style={styles.summaryItem}>
          <span style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#f5576c' }}>{totalAdmins}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Administrators</span>
        </div>
        <div style={styles.divider} />
        <div style={styles.summaryItem}>
          <span style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#43e97b' }}>{users.length}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Total Accounts</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' },
  filterBar: { padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '14px 20px', fontFamily: 'var(--font-heading)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' },
  tr: { transition: 'background 0.2s' },
  td: { padding: '16px 20px', fontSize: '0.88rem', borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'var(--text-secondary)', verticalAlign: 'middle' },
  userAvatar: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: {
    width: '36px', height: '36px', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.9rem',
  },
  summaryBox: { marginTop: '24px', padding: '24px 32px', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap', borderRadius: '16px' },
  summaryItem: { display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' },
  divider: { width: '1px', height: '40px', background: 'var(--border)' },
};

export default AdminUsers;
