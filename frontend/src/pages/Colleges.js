import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const Colleges = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  // const fetchColleges = async () => {
  //   setLoading(true);
  //   try {
  //     const params = {};
  //     if (search) params.search = search;
  //     if (category !== 'all') params.category = category;
  //     const { data } = await API.get('/colleges', { params });
  //     setColleges(data.data);
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => { fetchColleges(); }, [category]);

  // const handleSearch = (e) => { e.preventDefault(); fetchColleges(); };
  const fetchColleges = async () => {
  setLoading(true);
  try {
    const params = {};
    if (search) params.search = search;           // matches college name, course, location
    if (category !== 'all') params.category = category;
    const { data } = await API.get('/colleges', { params });
    setColleges(data.data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => { fetchColleges(); }, [category]);
const handleSearch = (e) => { e.preventDefault(); fetchColleges(); };

  const renderStars = (rating) => {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  };

  return (
    <div className="page">
      <div className="page-header fade-up">
        <h1 className="page-title">🏛️ Top Colleges</h1>
        <p className="page-subtitle">Find the best institutes for your career path in India</p>
      </div>

      {/* Filters */}
      <div className="glass" style={styles.filterBar}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', flex: 1, flexWrap: 'wrap' }}>
          <input
            className="form-input"
            placeholder="Search colleges, courses, locations..."
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

      <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
        {colleges.length} colleges listed
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : colleges.length === 0 ? (
        <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ fontFamily: 'var(--font-heading)' }}>No colleges found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-3" style={{ gap: '20px' }}>
          {colleges.map((col, i) => (
            <div key={col._id} className="glass" style={{ ...styles.card, animationDelay: `${i * 0.05}s` }}>
              <div style={styles.ratingBadge}>
                <span className="stars" style={{ fontSize: '0.8rem', color: '#ffd700' }}>{renderStars(col.rating)}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginLeft: '6px' }}>{col.rating}/5</span>
              </div>

              <h3 style={styles.colName}>{col.name}</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '12px 0' }}>
                <div style={styles.detail}>📍 {col.location}</div>
                <div style={styles.detail}>🎓 {col.course}</div>
                <div style={{ ...styles.detail, color: '#43e97b' }}>💸 {col.fees}</div>
              </div>

              {col.description && (
                <p style={styles.desc}>{col.description?.slice(0, 90)}...</p>
              )}

              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <span className="badge badge-purple" style={{ marginRight: '6px' }}>{col.category}</span>
                <span className="badge badge-cyan">{col.careerPath}</span>
              </div>

              {col.website && col.website !== '#' && (
                <a href={col.website} target="_blank" rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm" style={{ marginTop: '12px', textAlign: 'center' }}>
                  Visit Website ↗
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  filterBar: { padding: '20px 24px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' },
  card: {
    padding: '28px', display: 'flex', flexDirection: 'column', gap: '4px',
    animation: 'fadeUp 0.4s ease forwards', opacity: 0,
  },
  ratingBadge: { display: 'flex', alignItems: 'center', marginBottom: '8px' },
  colName: { fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3 },
  detail: { color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' },
  desc: { color: 'var(--text-muted)', fontSize: '0.83rem', lineHeight: 1.5 },
};

export default Colleges;
