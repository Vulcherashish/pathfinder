import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const defaultForm = {
  name: '', location: '', course: '', rating: 4.0,
  description: '', fees: '', category: 'tech',
  careerPath: 'developer', website: ''
};

const AdminColleges = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchColleges = async () => {
    try {
      const { data } = await API.get('/colleges');
      setColleges(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchColleges(); }, []);

  const notify = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        await API.put(`/colleges/${editId}`, form);
        notify('College updated!');
      } else {
        await API.post('/colleges', form);
        notify('College added!');
      }
      setForm(defaultForm);
      setEditId(null);
      setShowForm(false);
      fetchColleges();
    } catch (err) {
      notify(err.response?.data?.message || 'Operation failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (col) => {
    setForm(col);
    setEditId(col._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this college?')) return;
    try {
      await API.delete(`/colleges/${id}`);
      notify('College deleted.');
      fetchColleges();
    } catch {
      notify('Delete failed.', 'error');
    }
  };

  const renderStars = (r) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));

  return (
    <div className="page">
      <div style={styles.header}>
        <div>
          <h1 className="page-title">🏛️ Manage Colleges</h1>
          <p className="page-subtitle">{colleges.length} colleges in database</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(defaultForm); }}>
          {showForm ? '✕ Cancel' : '+ Add College'}
        </button>
      </div>

      {msg.text && <div className={`alert alert-${msg.type}`}>{msg.type === 'success' ? '✓' : '⚠️'} {msg.text}</div>}

      {showForm && (
        <div className="glass fade-up" style={styles.formBox}>
          <h3 style={styles.formTitle}>{editId ? '✏️ Edit College' : '+ New College'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">College Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. IIT Bombay" />
              </div>
              <div className="form-group">
                <label className="form-label">Location *</label>
                <input className="form-input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required placeholder="e.g. Mumbai, Maharashtra" />
              </div>
              <div className="form-group">
                <label className="form-label">Course *</label>
                <input className="form-input" value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} required placeholder="e.g. B.Tech Computer Science" />
              </div>
              <div className="form-group">
                <label className="form-label">Fees</label>
                <input className="form-input" value={form.fees} onChange={e => setForm({ ...form, fees: e.target.value })} placeholder="e.g. ₹2.5L/year" />
              </div>
              <div className="form-group">
                <label className="form-label">Rating (1–5)</label>
                <input type="number" className="form-input" value={form.rating} min={1} max={5} step={0.1}
                  onChange={e => setForm({ ...form, rating: parseFloat(e.target.value) })} />
              </div>
              <div className="form-group">
                <label className="form-label">Website</label>
                <input className="form-input" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://college.edu" />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {['tech', 'creative', 'business', 'all'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Career Path</label>
                <select className="form-select" value={form.careerPath} onChange={e => setForm({ ...form, careerPath: e.target.value })}>
                  {['developer', 'designer', 'management', 'analyst', 'all'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description of the college..." />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : editId ? 'Update College' : 'Add College'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setEditId(null); }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : (
        <div className="glass" style={{ overflowX: 'auto', borderRadius: '16px' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['College', 'Location', 'Course', 'Rating', 'Category', 'Actions'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {colleges.map(col => (
                <tr key={col._id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{col.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{col.fees}</div>
                  </td>
                  <td style={styles.td}>{col.location}</td>
                  <td style={styles.td}>{col.course}</td>
                  <td style={styles.td}>
                    <span style={{ color: '#ffd700' }}>{renderStars(col.rating)}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginLeft: '4px' }}>{col.rating}</span>
                  </td>
                  <td style={styles.td}><span className="badge badge-cyan">{col.category}</span></td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(col)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(col._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {colleges.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No colleges yet. Add the first one!</div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' },
  formBox: { padding: '32px', borderRadius: '20px', marginBottom: '32px' },
  formTitle: { fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '24px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '14px 20px', fontFamily: 'var(--font-heading)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' },
  tr: { transition: 'background 0.2s' },
  td: { padding: '16px 20px', fontSize: '0.88rem', borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'var(--text-secondary)', verticalAlign: 'middle' },
};

export default AdminColleges;
