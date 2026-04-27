import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const defaultForm = {
  title: '', company: '', skills: '', salary: '',
  description: '', category: 'tech', careerPath: 'developer',
  location: '', type: 'Full-time'
};

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchJobs = async () => {
    try {
      const { data } = await API.get('/jobs');
      setJobs(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, []);

  const notify = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) };
      if (editId) {
        await API.put(`/jobs/${editId}`, payload);
        notify('Job updated successfully!');
      } else {
        await API.post('/jobs', payload);
        notify('Job created successfully!');
      }
      setForm(defaultForm);
      setEditId(null);
      setShowForm(false);
      fetchJobs();
    } catch (err) {
      notify(err.response?.data?.message || 'Operation failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (job) => {
    setForm({ ...job, skills: job.skills?.join(', ') || '' });
    setEditId(job._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await API.delete(`/jobs/${id}`);
      notify('Job deleted.');
      fetchJobs();
    } catch (err) {
      notify('Delete failed.', 'error');
    }
  };

  return (
    <div className="page">
      <div style={styles.header}>
        <div>
          <h1 className="page-title">💼 Manage Jobs</h1>
          <p className="page-subtitle">{jobs.length} job listings in database</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm(defaultForm); }}>
          {showForm ? '✕ Cancel' : '+ Add Job'}
        </button>
      </div>

      {msg.text && <div className={`alert alert-${msg.type}`}>{msg.type === 'success' ? '✓' : '⚠️'} {msg.text}</div>}

      {showForm && (
        <div className="glass fade-up" style={styles.formBox}>
          <h3 style={styles.formTitle}>{editId ? '✏️ Edit Job' : '+ New Job'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Full Stack Developer" />
              </div>
              <div className="form-group">
                <label className="form-label">Company</label>
                <input className="form-input" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="e.g. TechCorp" />
              </div>
              <div className="form-group">
                <label className="form-label">Salary Range *</label>
                <input className="form-input" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} required placeholder="e.g. ₹8L - ₹20L/yr" />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Bangalore / Remote" />
              </div>
              <div className="form-group">
                <label className="form-label">Skills (comma-separated) *</label>
                <input className="form-input" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} required placeholder="React, Node.js, MongoDB" />
              </div>
              <div className="form-group">
                <label className="form-label">Job Type</label>
                <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  {['Full-time', 'Part-time', 'Contract', 'Internship'].map(t => <option key={t}>{t}</option>)}
                </select>
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
              <label className="form-label">Description *</label>
              <textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required placeholder="Describe the role, responsibilities, and requirements..." />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : editId ? 'Update Job' : 'Create Job'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setEditId(null); setForm(defaultForm); }}>
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
                {['Title', 'Company', 'Salary', 'Category', 'Type', 'Actions'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job._id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{job.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{job.skills?.slice(0, 3).join(', ')}</div>
                  </td>
                  <td style={styles.td}>{job.company}</td>
                  <td style={{ ...styles.td, color: '#43e97b', fontWeight: 600 }}>{job.salary}</td>
                  <td style={styles.td}><span className="badge badge-purple">{job.category}</span></td>
                  <td style={styles.td}><span className="badge badge-cyan">{job.type}</span></td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(job)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {jobs.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No jobs yet. Add the first one!</div>}
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

export default AdminJobs;
