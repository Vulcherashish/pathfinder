// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { Radar, Doughnut, Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   RadialLinearScale,
//   PointElement,
//   LineElement,
//   Filler,
//   Tooltip,
//   Legend,
//   ArcElement,
//   CategoryScale,
//   LinearScale,
//   BarElement,
// } from 'chart.js';
// import API from '../utils/api';

// ChartJS.register(
//   RadialLinearScale, PointElement, LineElement, Filler,
//   Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement
// );

// const Result = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [tab, setTab] = useState('overview');

//   useEffect(() => {
//     const fetch = async () => {
//       try {
//         const { data } = await API.get(`/analysis/${id}`);
//         setResult(data.data);
//       } catch (err) {
//         navigate('/dashboard');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetch();
//   }, [id, navigate]);

//   if (loading) return <div className="page"><div className="spinner-wrap"><div className="spinner" /></div></div>;
//   if (!result) return null;

//   const { career, scores, description, skills, recommendedJobs, recommendedColleges } = result.result;
//   const careerMeta = {
//     'Software Developer': { icon: '💻', color: '#7c6fff', badge: 'Technology' },
//     'UI/UX Designer': { icon: '🎨', color: '#f5576c', badge: 'Creative' },
//     'Business Manager': { icon: '📊', color: '#43e97b', badge: 'Business' },
//   };
//   const meta = careerMeta[career] || { icon: '🎯', color: '#7c6fff', badge: 'Career' };

//   const radarData = {
//     labels: ['Technical', 'Creative', 'Business', 'Analytical', 'Leadership'],
//     datasets: [{
//       label: 'Your Skills',
//       data: [scores.tech, scores.creative, scores.business, scores.analytical, scores.leadership],
//       backgroundColor: 'rgba(124, 111, 255, 0.2)',
//       borderColor: 'rgba(124, 111, 255, 0.8)',
//       borderWidth: 2,
//       pointBackgroundColor: 'rgba(124, 111, 255, 1)',
//       pointBorderColor: '#fff',
//       pointBorderWidth: 2,
//     }]
//   };

//   const doughnutData = {
//     labels: ['Technical', 'Creative', 'Business'],
//     datasets: [{
//       data: [scores.tech, scores.creative, scores.business],
//       backgroundColor: ['rgba(124,111,255,0.8)', 'rgba(245,87,108,0.8)', 'rgba(67,233,123,0.8)'],
//       borderColor: ['#7c6fff', '#f5576c', '#43e97b'],
//       borderWidth: 2,
//     }]
//   };

//   const barData = {
//     labels: ['Technical', 'Creative', 'Business', 'Analytical', 'Leadership'],
//     datasets: [{
//       label: 'Score (%)',
//       data: [scores.tech, scores.creative, scores.business, scores.analytical, scores.leadership],
//       backgroundColor: [
//         'rgba(124,111,255,0.7)', 'rgba(245,87,108,0.7)', 'rgba(67,233,123,0.7)',
//         'rgba(0,242,254,0.7)', 'rgba(250,112,154,0.7)'
//       ],
//       borderRadius: 8,
//       borderSkipped: false,
//     }]
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { labels: { color: '#f0f0ff', font: { family: 'DM Sans', size: 12 } } },
//       tooltip: {
//         backgroundColor: 'rgba(8,8,24,0.9)',
//         titleColor: '#f0f0ff',
//         bodyColor: 'rgba(240,240,255,0.7)',
//         borderColor: 'rgba(124,111,255,0.3)',
//         borderWidth: 1,
//       }
//     },
//     scales: {
//       r: {
//         angleLines: { color: 'rgba(255,255,255,0.1)' },
//         grid: { color: 'rgba(255,255,255,0.08)' },
//         pointLabels: { color: 'rgba(240,240,255,0.7)', font: { size: 11, family: 'DM Sans' } },
//         ticks: { backdropColor: 'transparent', color: 'rgba(240,240,255,0.5)', font: { size: 10 } },
//       },
//       x: { ticks: { color: 'rgba(240,240,255,0.6)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
//       y: { ticks: { color: 'rgba(240,240,255,0.6)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
//     }
//   };

//   const tabs = ['overview', 'charts', 'jobs', 'colleges'];

//   return (
//     <div className="page">
//       {/* Hero Result Card */}
//       <div className="glass fade-up" style={{ ...styles.heroCard, borderColor: `${meta.color}30` }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
//           <div style={{ ...styles.careerIcon, background: `${meta.color}20`, border: `2px solid ${meta.color}40` }}>
//             {meta.icon}
//           </div>
//           <div style={{ flex: 1 }}>
//             <div style={{ marginBottom: '8px' }}>
//               <span className="badge badge-purple" style={{ marginRight: '8px' }}>{meta.badge}</span>
//               <span className="badge badge-cyan">{result.quizType} quiz</span>
//             </div>
//             <h1 style={{ ...styles.careerTitle, color: meta.color }}>{career}</h1>
//             <p style={styles.careerDesc}>{description}</p>
//           </div>
//         </div>
//         <div style={styles.skillsRow}>
//           {skills?.map((s, i) => (
//             <span key={i} className="badge badge-purple" style={{ marginRight: '6px', marginBottom: '6px' }}>{s}</span>
//           ))}
//         </div>
//       </div>

//       {/* Tabs */}
//       <div style={styles.tabBar}>
//         {tabs.map(t => (
//           <button key={t} style={{ ...styles.tabBtn, ...(tab === t ? styles.tabActive : {}) }}
//             onClick={() => setTab(t)}>
//             {t.charAt(0).toUpperCase() + t.slice(1)}
//           </button>
//         ))}
//       </div>

//       {/* Overview */}
//       {tab === 'overview' && (
//         <div className="grid grid-2 fade-up" style={{ gap: '24px' }}>
//           <div className="glass" style={styles.chartBox}>
//             <h3 style={styles.chartTitle}>Skill Radar</h3>
//             <div style={{ height: '300px' }}>
//               <Radar data={radarData} options={{ ...chartOptions, scales: { r: chartOptions.scales.r } }} />
//             </div>
//           </div>
//           <div className="glass" style={styles.chartBox}>
//             <h3 style={styles.chartTitle}>Career Profile</h3>
//             <div style={{ height: '300px' }}>
//               <Doughnut data={doughnutData} options={{ ...chartOptions, scales: undefined }} />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Charts */}
//       {tab === 'charts' && (
//         <div className="fade-up">
//           <div className="glass" style={{ ...styles.chartBox, marginBottom: '24px' }}>
//             <h3 style={styles.chartTitle}>Score Breakdown</h3>
//             <div style={{ height: '320px' }}>
//               <Bar data={barData} options={{ ...chartOptions, scales: { x: chartOptions.scales.x, y: { ...chartOptions.scales.y, max: 100 } } }} />
//             </div>
//           </div>
//           <div className="grid grid-3" style={{ gap: '16px' }}>
//             {Object.entries(scores).map(([key, val]) => (
//               <div key={key} className="glass" style={styles.scoreCard}>
//                 <div style={styles.scoreLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</div>
//                 <div style={styles.scoreValue}>{val}%</div>
//                 <div style={styles.scoreBar}>
//                   <div style={{ ...styles.scoreFill, width: `${val}%` }} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Jobs */}
//       {tab === 'jobs' && (
//         <div className="fade-up">
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//             <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Recommended Jobs</h2>
//             <Link to="/jobs" className="btn btn-secondary btn-sm">View All →</Link>
//           </div>
//           {recommendedJobs?.length === 0 ? (
//             <div className="glass" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
//               No job recommendations yet. <Link to="/jobs">Browse all jobs</Link>
//             </div>
//           ) : (
//             <div className="grid grid-2" style={{ gap: '16px' }}>
//               {recommendedJobs?.map(job => (
//                 <div key={job._id} className="glass" style={styles.recCard}>
//                   <div style={styles.recTitle}>{job.title}</div>
//                   <div style={styles.recSalary}>💰 {job.salary}</div>
//                   <p style={styles.recDesc}>{job.description?.slice(0, 100)}...</p>
//                   <div style={{ marginTop: '12px' }}>
//                     {job.skills?.slice(0, 3).map((s, i) => (
//                       <span key={i} className="badge badge-purple" style={{ marginRight: '6px', marginBottom: '4px' }}>{s}</span>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Colleges */}
//       {tab === 'colleges' && (
//         <div className="fade-up">
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//             <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Recommended Colleges</h2>
//             <Link to="/colleges" className="btn btn-secondary btn-sm">View All →</Link>
//           </div>
//           {recommendedColleges?.length === 0 ? (
//             <div className="glass" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
//               No college recommendations yet. <Link to="/colleges">Browse all colleges</Link>
//             </div>
//           ) : (
//             <div className="grid grid-2" style={{ gap: '16px' }}>
//               {recommendedColleges?.map(col => (
//                 <div key={col._id} className="glass" style={styles.recCard}>
//                   <div style={styles.recTitle}>{col.name}</div>
//                   <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0' }}>
//                     📍 {col.location}
//                   </div>
//                   <div className="badge badge-cyan" style={{ marginBottom: '8px' }}>{col.course}</div>
//                   <div className="stars">{'★'.repeat(Math.round(col.rating))}{'☆'.repeat(5 - Math.round(col.rating))}</div>
//                   <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '6px' }}>Fees: {col.fees}</div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       <div style={{ marginTop: '40px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
//         <Link to="/quiz" className="btn btn-primary">Retake Quiz</Link>
//         <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   heroCard: { padding: '40px', borderRadius: '24px', marginBottom: '32px' },
//   careerIcon: {
//     width: '80px', height: '80px', borderRadius: '20px',
//     display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', flexShrink: 0,
//   },
//   careerTitle: { fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' },
//   careerDesc: { color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '600px' },
//   skillsRow: { marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '20px' },
//   tabBar: { display: 'flex', gap: '4px', marginBottom: '28px', background: 'var(--bg-card)', padding: '4px', borderRadius: '12px', width: 'fit-content' },
//   tabBtn: {
//     padding: '8px 20px', borderRadius: '9px', border: 'none',
//     background: 'transparent', color: 'var(--text-secondary)',
//     fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.85rem',
//     cursor: 'pointer', transition: 'all 0.2s ease', textTransform: 'capitalize',
//   },
//   tabActive: { background: 'rgba(124,111,255,0.2)', color: 'var(--text-primary)' },
//   chartBox: { padding: '28px' },
//   chartTitle: { fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '20px', fontSize: '1rem' },
//   scoreCard: { padding: '20px' },
//   scoreLabel: { fontFamily: 'var(--font-heading)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '6px' },
//   scoreValue: { fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '10px' },
//   scoreBar: { height: '4px', background: 'var(--border)', borderRadius: '2px' },
//   scoreFill: { height: '100%', background: 'var(--grad-1)', borderRadius: '2px', transition: 'width 1s ease' },
//   recCard: { padding: '24px' },
//   recTitle: { fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' },
//   recSalary: { color: '#43e97b', fontSize: '0.85rem', marginBottom: '8px' },
//   recDesc: { color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 },
// };

// export default Result;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Radar, Doughnut, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import API from '../utils/api';

ChartJS.register(
  RadialLinearScale, PointElement, LineElement, Filler,
  Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement
);

const Result = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get(`/analysis/${id}`);
        setResult(data.data);
      } catch (err) {
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  if (loading) return <div className="page"><div className="spinner-wrap"><div className="spinner" /></div></div>;
  if (!result) return null;

  const { career, scores, description, skills, recommendedJobs, recommendedColleges } = result.result;
  
  // ✅ NEW: Accuracy metrics
  const { totalQuestions, correctAnswers, wrongAnswers, accuracy, totalScore, maxPossibleScore } = result.result;

  const careerMeta = {
    'Software Developer': { icon: '💻', color: '#7c6fff', badge: 'Technology' },
    'UI/UX Designer': { icon: '🎨', color: '#f5576c', badge: 'Creative' },
    'Business Manager': { icon: '📊', color: '#43e97b', badge: 'Business' },
  };
  const meta = careerMeta[career] || { icon: '🎯', color: '#7c6fff', badge: 'Career' };

  const radarData = {
    labels: ['Technical', 'Creative', 'Business', 'Analytical', 'Leadership'],
    datasets: [{
      label: 'Your Skills',
      data: [scores.tech, scores.creative, scores.business, scores.analytical, scores.leadership],
      backgroundColor: 'rgba(124, 111, 255, 0.2)',
      borderColor: 'rgba(124, 111, 255, 0.8)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(124, 111, 255, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    }]
  };

  const doughnutData = {
    labels: ['Technical', 'Creative', 'Business'],
    datasets: [{
      data: [scores.tech, scores.creative, scores.business],
      backgroundColor: ['rgba(124,111,255,0.8)', 'rgba(245,87,108,0.8)', 'rgba(67,233,123,0.8)'],
      borderColor: ['#7c6fff', '#f5576c', '#43e97b'],
      borderWidth: 2,
    }]
  };

  // ✅ NEW: Accuracy pie chart
  const accuracyData = {
    labels: ['Correct', 'Wrong'],
    datasets: [{
      data: [correctAnswers || 0, wrongAnswers || 0],
      backgroundColor: ['rgba(76,175,80,0.8)', 'rgba(244,67,54,0.8)'],
      borderColor: ['#4caf50', '#f44336'],
      borderWidth: 2,
    }]
  };

  const barData = {
    labels: ['Technical', 'Creative', 'Business', 'Analytical', 'Leadership'],
    datasets: [{
      label: 'Score (%)',
      data: [scores.tech, scores.creative, scores.business, scores.analytical, scores.leadership],
      backgroundColor: [
        'rgba(124,111,255,0.7)', 'rgba(245,87,108,0.7)', 'rgba(67,233,123,0.7)',
        'rgba(0,242,254,0.7)', 'rgba(250,112,154,0.7)'
      ],
      borderRadius: 8,
      borderSkipped: false,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#f0f0ff', font: { family: 'DM Sans', size: 12 } } },
      tooltip: {
        backgroundColor: 'rgba(8,8,24,0.9)',
        titleColor: '#f0f0ff',
        bodyColor: 'rgba(240,240,255,0.7)',
        borderColor: 'rgba(124,111,255,0.3)',
        borderWidth: 1,
      }
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(255,255,255,0.1)' },
        grid: { color: 'rgba(255,255,255,0.08)' },
        pointLabels: { color: 'rgba(240,240,255,0.7)', font: { size: 11, family: 'DM Sans' } },
        ticks: { backdropColor: 'transparent', color: 'rgba(240,240,255,0.5)', font: { size: 10 } },
      },
      x: { ticks: { color: 'rgba(240,240,255,0.6)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: 'rgba(240,240,255,0.6)' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    }
  };

  const tabs = ['overview', 'accuracy', 'charts', 'answers', 'jobs', 'colleges'];

  return (
    <div className="page">
      {/* Hero Result Card */}
      <div className="glass fade-up" style={{ ...styles.heroCard, borderColor: `${meta.color}30` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ ...styles.careerIcon, background: `${meta.color}20`, border: `2px solid ${meta.color}40` }}>
            {meta.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '8px' }}>
              <span className="badge badge-purple" style={{ marginRight: '8px' }}>{meta.badge}</span>
              <span className="badge badge-cyan">{result.quizType} quiz</span>
            </div>
            <h1 style={{ ...styles.careerTitle, color: meta.color }}>{career}</h1>
            <p style={styles.careerDesc}>{description}</p>
          </div>
        </div>
        <div style={styles.skillsRow}>
          {skills?.map((s, i) => (
            <span key={i} className="badge badge-purple" style={{ marginRight: '6px', marginBottom: '6px' }}>{s}</span>
          ))}
        </div>
      </div>

      {/* ✅ NEW: Accuracy Card */}
      <div className="glass fade-up" style={{
        padding: '24px',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(76,175,80,0.1), rgba(244,67,54,0.05))',
        border: '1px solid rgba(76,175,80,0.3)',
        borderRadius: '16px'
      }}>
        <h3 style={{ marginBottom: '16px', fontWeight: 700, fontSize: '1.1rem' }}>📊 Quiz Performance</h3>
        <div className="grid grid-4" style={{ gap: '16px' }}>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Total Questions</div>
            <div style={{ ...styles.metricValue, color: '#7c6fff' }}>{totalQuestions || 0}</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Correct Answers</div>
            <div style={{ ...styles.metricValue, color: '#4caf50' }}>{correctAnswers || 0}</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Wrong Answers</div>
            <div style={{ ...styles.metricValue, color: '#f44336' }}>{wrongAnswers || 0}</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricLabel}>Accuracy</div>
            <div style={{ ...styles.metricValue, color: accuracy >= 70 ? '#4caf50' : accuracy >= 50 ? '#ff9800' : '#f44336' }}>
              {accuracy || 0}%
            </div>
          </div>
        </div>
        <div style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Score: <strong>{totalScore || 0}/{maxPossibleScore || 0}</strong>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabBar}>
        {tabs.map(t => (
          <button key={t} style={{ ...styles.tabBtn, ...(tab === t ? styles.tabActive : {}) }}
            onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="grid grid-2 fade-up" style={{ gap: '24px' }}>
          <div className="glass" style={styles.chartBox}>
            <h3 style={styles.chartTitle}>Skill Radar</h3>
            <div style={{ height: '300px' }}>
              <Radar data={radarData} options={{ ...chartOptions, scales: { r: chartOptions.scales.r } }} />
            </div>
          </div>
          <div className="glass" style={styles.chartBox}>
            <h3 style={styles.chartTitle}>Career Profile</h3>
            <div style={{ height: '300px' }}>
              <Doughnut data={doughnutData} options={{ ...chartOptions, scales: undefined }} />
            </div>
          </div>
        </div>
      )}

      {/* ✅ NEW: Accuracy Tab */}
      {tab === 'accuracy' && (
        <div className="grid grid-2 fade-up" style={{ gap: '24px' }}>
          <div className="glass" style={styles.chartBox}>
            <h3 style={styles.chartTitle}>Answer Accuracy</h3>
            <div style={{ height: '300px' }}>
              <Pie data={accuracyData} options={{ ...chartOptions, scales: undefined }} />
            </div>
          </div>
          <div className="glass" style={{ padding: '28px' }}>
            <h3 style={styles.chartTitle}>Performance Summary</h3>
            <div style={{ marginTop: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>Accuracy Rate</span>
                  <strong style={{ color: accuracy >= 70 ? '#4caf50' : accuracy >= 50 ? '#ff9800' : '#f44336' }}>
                    {accuracy || 0}%
                  </strong>
                </div>
                <div style={{
                  height: '8px',
                  background: 'var(--border)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${accuracy || 0}%`,
                    background: accuracy >= 70 ? '#4caf50' : accuracy >= 50 ? '#ff9800' : '#f44336',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>

              <div style={{ 
                marginTop: '24px', 
                padding: '16px', 
                background: 'rgba(76,175,80,0.1)', 
                borderRadius: '8px',
                border: '1px solid rgba(76,175,80,0.3)'
              }}>
                <p style={{ margin: 0, color: '#2e7d32', fontWeight: 600 }}>
                  ✅ Correct: {correctAnswers || 0}/{totalQuestions || 0} answers
                </p>
              </div>

              <div style={{ 
                marginTop: '12px', 
                padding: '16px', 
                background: 'rgba(244,67,54,0.1)', 
                borderRadius: '8px',
                border: '1px solid rgba(244,67,54,0.3)'
              }}>
                <p style={{ margin: 0, color: '#c62828', fontWeight: 600 }}>
                  ❌ Wrong: {wrongAnswers || 0}/{totalQuestions || 0} answers
                </p>
              </div>

              <div style={{ 
                marginTop: '12px', 
                padding: '16px', 
                background: 'rgba(124,111,255,0.1)', 
                borderRadius: '8px',
                border: '1px solid rgba(124,111,255,0.3)'
              }}>
                <p style={{ margin: 0, color: '#7c6fff', fontWeight: 600 }}>
                  🎯 Score: {totalScore || 0}/{maxPossibleScore || 0} points
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      {tab === 'charts' && (
        <div className="fade-up">
          <div className="glass" style={{ ...styles.chartBox, marginBottom: '24px' }}>
            <h3 style={styles.chartTitle}>Score Breakdown</h3>
            <div style={{ height: '320px' }}>
              <Bar data={barData} options={{ ...chartOptions, scales: { x: chartOptions.scales.x, y: { ...chartOptions.scales.y, max: 100 } } }} />
            </div>
          </div>
          <div className="grid grid-3" style={{ gap: '16px' }}>
            {Object.entries(scores).map(([key, val]) => (
              <div key={key} className="glass" style={styles.scoreCard}>
                <div style={styles.scoreLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                <div style={styles.scoreValue}>{val}%</div>
                <div style={styles.scoreBar}>
                  <div style={{ ...styles.scoreFill, width: `${val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ NEW: Answers Tab - Show which questions were correct/wrong */}
      {tab === 'answers' && (
        <div className="fade-up">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '20px' }}>Answer Review</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {result.answers.map((ans, idx) => (
              <div 
                key={idx} 
                className="glass" 
                style={{
                  padding: '20px',
                  borderLeft: `4px solid ${ans.isCorrect ? '#4caf50' : '#f44336'}`,
                  background: ans.isCorrect ? 'rgba(76,175,80,0.05)' : 'rgba(244,67,54,0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontWeight: 700 }}>Q{idx + 1}: {ans.question}</h4>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span className="badge badge-cyan">Your Answer: {ans.answer}</span>
                      <span className={`badge ${ans.isCorrect ? 'badge-success' : 'badge-danger'}`}>
                        {ans.isCorrect ? '✅ Correct' : `❌ Wrong (Answer: ${ans.correctAnswer})`}
                      </span>
                    </div>
                  </div>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: ans.isCorrect ? '#4caf50' : '#f44336'
                  }}>
                    {ans.isCorrect ? '✓' : '✗'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Jobs */}
      {tab === 'jobs' && (
        <div className="fade-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Recommended Jobs</h2>
            <Link to="/jobs" className="btn btn-secondary btn-sm">View All →</Link>
          </div>
          {recommendedJobs?.length === 0 ? (
            <div className="glass" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No job recommendations yet. <Link to="/jobs">Browse all jobs</Link>
            </div>
          ) : (
            <div className="grid grid-2" style={{ gap: '16px' }}>
              {recommendedJobs?.map(job => (
                <div key={job._id} className="glass" style={styles.recCard}>
                  <div style={styles.recTitle}>{job.title}</div>
                  <div style={styles.recSalary}>💰 {job.salary}</div>
                  <p style={styles.recDesc}>{job.description?.slice(0, 100)}...</p>
                  <div style={{ marginTop: '12px' }}>
                    {job.skills?.slice(0, 3).map((s, i) => (
                      <span key={i} className="badge badge-purple" style={{ marginRight: '6px', marginBottom: '4px' }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Colleges */}
      {tab === 'colleges' && (
        <div className="fade-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Recommended Colleges</h2>
            <Link to="/colleges" className="btn btn-secondary btn-sm">View All →</Link>
          </div>
          {recommendedColleges?.length === 0 ? (
            <div className="glass" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No college recommendations yet. <Link to="/colleges">Browse all colleges</Link>
            </div>
          ) : (
            <div className="grid grid-2" style={{ gap: '16px' }}>
              {recommendedColleges?.map(col => (
                <div key={col._id} className="glass" style={styles.recCard}>
                  <div style={styles.recTitle}>{col.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0' }}>
                    📍 {col.location}
                  </div>
                  <div className="badge badge-cyan" style={{ marginBottom: '8px' }}>{col.course}</div>
                  <div className="stars">{'★'.repeat(Math.round(col.rating))}{'☆'.repeat(5 - Math.round(col.rating))}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '6px' }}>Fees: {col.fees}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '40px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link to="/quiz" className="btn btn-primary">Retake Quiz</Link>
        <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
      </div>
    </div>
  );
};

const styles = {
  heroCard: { padding: '40px', borderRadius: '24px', marginBottom: '32px' },
  careerIcon: {
    width: '80px', height: '80px', borderRadius: '20px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', flexShrink: 0,
  },
  careerTitle: { fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' },
  careerDesc: { color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '600px' },
  skillsRow: { marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '20px' },
  tabBar: { display: 'flex', gap: '4px', marginBottom: '28px', background: 'var(--bg-card)', padding: '4px', borderRadius: '12px', width: 'fit-content', flexWrap: 'wrap' },
  tabBtn: {
    padding: '8px 16px', borderRadius: '9px', border: 'none',
    background: 'transparent', color: 'var(--text-secondary)',
    fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.85rem',
    cursor: 'pointer', transition: 'all 0.2s ease', textTransform: 'capitalize',
  },
  tabActive: { background: 'rgba(124,111,255,0.2)', color: 'var(--text-primary)' },
  chartBox: { padding: '28px' },
  chartTitle: { fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '20px', fontSize: '1rem' },
  metricCard: { 
    padding: '16px', 
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid var(--border)'
  },
  metricLabel: { fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' },
  metricValue: { fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' },
  scoreCard: { padding: '20px' },
  scoreLabel: { fontFamily: 'var(--font-heading)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: '6px' },
  scoreValue: { fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '10px' },
  scoreBar: { height: '4px', background: 'var(--border)', borderRadius: '2px' },
  scoreFill: { height: '100%', background: 'var(--grad-1)', borderRadius: '2px', transition: 'width 1s ease' },
  recCard: { padding: '24px' },
  recTitle: { fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' },
  recSalary: { color: '#43e97b', fontSize: '0.85rem', marginBottom: '8px' },
  recDesc: { color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 },
};

export default Result;