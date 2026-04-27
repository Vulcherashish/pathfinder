import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [expanded, setExpanded] = useState(null);

  // const fetchJobs = async () => {
  //   setLoading(true);
  //   try {
  //     const params = {};
  //     if (search) params.search = search;
  //     if (category !== 'all') params.category = category;
  //     const { data } = await API.get('/jobs', { params });
  //     setJobs(data.data);
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => { fetchJobs(); }, [category]);
const fetchJobs = async () => {
  setLoading(true);
  try {
    const params = {};
    if (search) params.search = search;           // matches title OR skills
    if (category !== 'all') params.category = category;
    const { data } = await API.get('/jobs', { params });
    setJobs(data.data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => { fetchJobs(); }, [category]);
const handleSearch = (e) => { e.preventDefault(); fetchJobs(); };
  

  const categoryColors = { tech: 'badge-purple', creative: 'badge-pink', business: 'badge-green', all: 'badge-cyan' };

  return (
    <div className="page">
      <div className="page-header fade-up">
        <h1 className="page-title">💼 Job Opportunities</h1>
        <p className="page-subtitle">Explore career openings tailored to your skills and interests</p>
      </div>

      {/* Filters */}
      <div className="glass" style={styles.filterBar}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', flex: 1, flexWrap: 'wrap' }}>
          <input
            className="form-input"
            placeholder="Search jobs, skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '200px' }}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'tech', 'creative', 'business'].map(c => (
            <button key={c} className={`btn ${category === c ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setCategory(c)}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div style={styles.statsRow}>
        <span style={styles.countText}>{jobs.length} jobs found</span>
      </div>

      {/* Jobs grid */}
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : jobs.length === 0 ? (
        <div className="glass" style={styles.empty}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ fontFamily: 'var(--font-heading)' }}>No jobs found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Try a different search term or category</p>
        </div>
      ) : (
        <div className="grid grid-2" style={{ gap: '20px' }}>
          {jobs.map((job, i) => (
            <div key={job._id} className="glass" style={{ ...styles.jobCard, animationDelay: `${i * 0.05}s` }}>
              <div style={styles.jobHeader}>
                <div>
                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                    🏢 {job.company} · 📍 {job.location}
                  </div>
                </div>
                <span className={`badge ${categoryColors[job.category] || 'badge-purple'}`}>{job.type}</span>
              </div>

              <div style={styles.jobSalary}>💰 {job.salary}</div>

              {expanded === job._id ? (
                <p style={styles.jobDesc}>{job.description}</p>
              ) : (
                <p style={styles.jobDesc}>{job.description?.slice(0, 90)}...</p>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                {job.skills?.map((s, si) => (
                  <span key={si} className="badge badge-purple">{s}</span>
                ))}
              </div>

              <button className="btn btn-secondary btn-sm" style={{ marginTop: '16px', alignSelf: 'flex-start' }}
                onClick={() => setExpanded(expanded === job._id ? null : job._id)}>
                {expanded === job._id ? 'Show Less ↑' : 'Read More ↓'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  filterBar: { padding: '20px 24px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' },
  statsRow: { marginBottom: '20px' },
  countText: { color: 'var(--text-secondary)', fontSize: '0.88rem' },
  empty: { padding: '60px', textAlign: 'center' },
  jobCard: {
    padding: '28px', borderRadius: '16px',
    display: 'flex', flexDirection: 'column', gap: '8px',
    animation: 'fadeUp 0.4s ease forwards', opacity: 0,
    transition: 'all 0.3s ease',
  },
  jobHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' },
  jobTitle: { fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700 },
  jobSalary: { color: '#43e97b', fontSize: '0.88rem', fontWeight: 600 },
  jobDesc: { color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 },
};

export default Jobs;
