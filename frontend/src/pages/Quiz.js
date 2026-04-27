
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../utils/api';

// const Quiz = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState('select');
//   const [quizType, setQuizType] = useState('');
//   const [currentQ, setCurrentQ] = useState(0);
//   const [answers, setAnswers] = useState([]);
//   const [selected, setSelected] = useState('');
//   const [error, setError] = useState('');
//   const [quizData, setQuizData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchQuiz = async () => {
//       try {
//         const { data } = await API.get('/quiz');
//         setQuizData(data.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuiz();
//   }, []);

//   const quizTypes = [
//     { id: 'tech', label: 'Technology', icon: '💻', desc: 'Are you drawn to coding, systems, and building software?', color: 'var(--grad-1)' },
//     { id: 'creative', label: 'Creative', icon: '🎨', desc: 'Do you have an eye for design, aesthetics, and visual storytelling?', color: 'var(--grad-2)' },
//     { id: 'business', label: 'Business', icon: '📊', desc: 'Are you a natural leader with strategic and entrepreneurial instincts?', color: 'var(--grad-4)' },
//   ];

//   const startQuiz = (type) => {
//     setQuizType(type);
//     setAnswers([]);
//     setCurrentQ(0);
//     setSelected('');
//     setStep('quiz');
//   };

//   // ✅ FIX: SAFE ACCESS
//   const questions = quizData?.[quizType] || [];
//   const question = questions[currentQ];
//   const progress = questions.length > 0 ? ((currentQ) / questions.length) * 100 : 0;

//   const handleNext = async () => {
//     if (!selected) return setError('Please select an answer to continue.');
//     setError('');

//     const newAnswers = [
//       ...answers,
//       {
//         questionId: question.id,
//         question: question.question,
//         answer: selected,
//         score: question.scores[selected]
//       }
//     ];
//     setAnswers(newAnswers);

//     if (currentQ + 1 < questions.length) {
//       setCurrentQ(currentQ + 1);
//       setSelected('');
//     } else {
//       setStep('submitting');
//       try {
//         const { data } = await API.post('/analysis/submit', { quizType, answers: newAnswers });
//         navigate(`/result/${data.data._id}`);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Submission failed.');
//         setStep('quiz');
//       }
//     }
//   };

//   // ✅ FIX: LOADING GUARD
//   if (loading || !quizData) return <p>Loading quiz...</p>;

//   if (step === 'submitting') {
//     return (
//       <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <div className="glass fade-in" style={styles.submittingCard}>
//           <div style={styles.submitSpinner} />
//           <h2 style={{ fontFamily: 'var(--font-heading)', marginTop: '24px' }}>Analysing your responses...</h2>
//           <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Our AI is finding your perfect career match</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="page" style={{ maxWidth: '760px' }}>
//       <div style={styles.progressWrap}>
//         <div style={styles.progressInfo}>
//           <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
//             Question {currentQ + 1} / {questions.length}
//           </span>
//           <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{quizType} track</span>
//         </div>
//         <div style={styles.progressBar}>
//           <div style={{ ...styles.progressFill, width: `${progress}%` }} />
//         </div>
//       </div>

//       <div className="glass fade-up" style={styles.questionCard} key={currentQ}>
//         <div style={styles.qNumber}>Q{currentQ + 1}</div>
//         <h2 style={styles.questionText}>{question?.question}</h2>

//         {error && <div className="alert alert-error">⚠️ {error}</div>}

//         <div style={styles.optionsGrid}>
//           {question && Object.entries(question.options || {}).map(([key, value]) => (
//             <div key={key}
//               style={{ ...styles.option, ...(selected === key ? styles.optionSelected : {}) }}
//               onClick={() => { setSelected(key); setError(''); }}>
//               <div style={{ ...styles.optionKey, ...(selected === key ? styles.optionKeySelected : {}) }}>
//                 {key}
//               </div>
//               <span style={styles.optionText}>{value}</span>
//             </div>
//           ))}
//         </div>

//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
//           <button className="btn btn-secondary"
//             onClick={() => { setCurrentQ(Math.max(0, currentQ - 1)); setSelected(''); }}
//             disabled={currentQ === 0}>
//             ← Back
//           </button>
//           <button className="btn btn-primary btn-lg" onClick={handleNext} disabled={!selected}>
//             {currentQ + 1 === questions.length ? 'Submit Quiz 🎯' : 'Next →'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   typeCard: {
//     padding: '36px 28px',
//     cursor: 'pointer',
//     display: 'flex', flexDirection: 'column', gap: '12px',
//     animation: 'fadeUp 0.5s ease forwards', opacity: 0,
//     transition: 'all 0.3s ease',
//   },
//   typeIcon: {
//     width: '56px', height: '56px', borderRadius: '16px',
//     display: 'flex', alignItems: 'center', justifyContent: 'center',
//     fontSize: '1.8rem',
//   },
//   typeTitle: { fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700 },
//   typeDesc: { color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, flex: 1 },
//   typeArrow: { color: 'var(--accent)', fontFamily: 'var(--font-heading)', fontWeight: 700 },
//   infoBox: { marginTop: '32px', padding: '24px 28px' },
//   submittingCard: {
//     padding: '60px 40px', textAlign: 'center', borderRadius: '24px',
//     display: 'flex', flexDirection: 'column', alignItems: 'center',
//   },
//   submitSpinner: {
//     width: '64px', height: '64px',
//     border: '4px solid var(--border)',
//     borderTopColor: 'var(--accent)',
//     borderRadius: '50%',
//     animation: 'spin 0.8s linear infinite',
//   },
//   progressWrap: { marginBottom: '32px' },
//   progressInfo: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
//   progressBar: { height: '6px', background: 'var(--bg-card)', borderRadius: '3px', overflow: 'hidden' },
//   progressFill: {
//     height: '100%', borderRadius: '3px',
//     background: 'linear-gradient(90deg, #667eea, #764ba2)',
//     transition: 'width 0.4s ease',
//   },
//   questionCard: { padding: '48px', borderRadius: '24px' },
//   qNumber: {
//     display: 'inline-block',
//     padding: '4px 12px', borderRadius: '6px',
//     background: 'rgba(124,111,255,0.15)', color: 'var(--accent)',
//     fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem',
//     marginBottom: '16px',
//   },
//   questionText: { fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '32px' },
//   optionsGrid: { display: 'flex', flexDirection: 'column', gap: '12px' },
//   option: {
//     display: 'flex', alignItems: 'center', gap: '16px',
//     padding: '16px 20px', borderRadius: '12px',
//     border: '1px solid var(--border)',
//     cursor: 'pointer', transition: 'all 0.2s ease',
//     background: 'transparent',
//   },
//   optionSelected: {
//     border: '1px solid var(--accent)',
//     background: 'rgba(124,111,255,0.1)',
//   },
//   optionKey: {
//     width: '36px', height: '36px', borderRadius: '8px',
//     background: 'rgba(255,255,255,0.06)',
//     display: 'flex', alignItems: 'center', justifyContent: 'center',
//     fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.9rem',
//     flexShrink: 0, transition: 'all 0.2s ease',
//   },
//   optionKeySelected: { background: 'var(--accent)', color: '#fff' },
//   optionText: { fontSize: '0.95rem', lineHeight: 1.5 },
// };

// export default Quiz;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const Quiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('select');
  const [quizType, setQuizType] = useState('');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await API.get('/quiz');
        console.log('✅ Quiz data fetched:', data);
        setQuizData(data.data);
      } catch (err) {
        console.error('❌ Quiz fetch error:', err);
        setError('Failed to load quiz questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []);

  const quizTypes = [
    { id: 'tech', label: 'Technology', icon: '💻', desc: 'Are you drawn to coding, systems, and building software?', color: 'var(--grad-1)' },
    { id: 'creative', label: 'Creative', icon: '🎨', desc: 'Do you have an eye for design, aesthetics, and visual storytelling?', color: 'var(--grad-2)' },
    { id: 'business', label: 'Business', icon: '📊', desc: 'Are you a natural leader with strategic and entrepreneurial instincts?', color: 'var(--grad-4)' },
  ];

  const startQuiz = (type) => {
    const typeQuestions = quizData?.[type] || [];
    if (typeQuestions.length === 0) {
      setError(`No questions available for ${type} track`);
      return;
    }
    setQuizType(type);
    setAnswers([]);
    setCurrentQ(0);
    setSelected('');
    setError('');
    setStep('quiz');
  };

  // ✅ SAFE ACCESS TO QUESTIONS
  const questions = quizData?.[quizType] || [];
  const question = questions[currentQ];
  const progress = questions.length > 0 ? ((currentQ) / questions.length) * 100 : 0;

  const handleNext = async () => {
    if (!selected) return setError('Please select an answer to continue.');
    setError('');

    const newAnswers = [
      ...answers,
      {
        questionId: question.id,
        question: question.question,
        answer: selected,
        score: question.scores[selected]
      }
    ];
    setAnswers(newAnswers);

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
      setSelected('');
    } else {
      setStep('submitting');
      try {
        const { data } = await API.post('/analysis/submit', { quizType, answers: newAnswers });
        navigate(`/result/${data.data._id}`);
      } catch (err) {
        setError(err.response?.data?.message || 'Submission failed.');
        setStep('quiz');
      }
    }
  };

  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="glass" style={styles.loadingCard}>
          <div style={styles.spinner} />
          <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  // ✅ ERROR STATE
  if (error && step === 'select') {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="glass" style={styles.errorCard}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ marginBottom: '8px' }}>Error Loading Quiz</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ✅ SUBMITTING STATE
  if (step === 'submitting') {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="glass fade-in" style={styles.submittingCard}>
          <div style={styles.submitSpinner} />
          <h2 style={{ fontFamily: 'var(--font-heading)', marginTop: '24px' }}>Analysing your responses...</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Our AI is finding your perfect career match</p>
        </div>
      </div>
    );
  }

  // ✅ QUIZ TYPE SELECTION SCREEN
  if (step === 'select') {
    return (
      <div className="page" style={{ maxWidth: '1000px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={styles.pageTitle}>🎯 Choose Your Career Path</h1>
          <p style={styles.pageSubtitle}>Select the track that interests you most</p>
        </div>

        {error && (
          <div style={{
            padding: '16px',
            borderRadius: '8px',
            background: 'rgba(244,67,54,0.1)',
            border: '1px solid #f44336',
            color: '#c62828',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {quizTypes.map((type) => (
            <div
              key={type.id}
              className="glass"
              onClick={() => startQuiz(type.id)}
              style={{
                ...styles.typeCard,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(124,111,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ ...styles.typeIcon, background: type.color }}>
                {type.icon}
              </div>
              <h3 style={styles.typeTitle}>{type.label}</h3>
              <p style={styles.typeDesc}>{type.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto', color: 'var(--accent)', fontWeight: 700 }}>
                Start Quiz <span style={{ marginLeft: '8px' }}>→</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px', padding: '24px', borderRadius: '12px', background: 'rgba(124,111,255,0.05)', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '12px', fontWeight: 700 }}>📋 How it works</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)' }}>
            <li>Answer 10 questions about your interests and skills</li>
            <li>Get personalized career recommendations</li>
            <li>Find matching colleges and job opportunities</li>
          </ul>
        </div>
      </div>
    );
  }

  // ✅ QUIZ QUESTION SCREEN
  return (
    <div className="page" style={{ maxWidth: '760px' }}>
      <div style={styles.progressWrap}>
        <div style={styles.progressInfo}>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
            Question {currentQ + 1} / {questions.length}
          </span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {quizType.charAt(0).toUpperCase() + quizType.slice(1)} track
          </span>
        </div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
      </div>

      <div className="glass fade-up" style={styles.questionCard} key={currentQ}>
        <div style={styles.qNumber}>Q{currentQ + 1}</div>
        <h2 style={styles.questionText}>{question?.question}</h2>

        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <div style={styles.optionsGrid}>
          {question && Object.entries(question.options || {}).map(([key, value]) => (
            <div
              key={key}
              style={{
                ...styles.option,
                ...(selected === key ? styles.optionSelected : {})
              }}
              onClick={() => {
                setSelected(key);
                setError('');
              }}
            >
              <div style={{
                ...styles.optionKey,
                ...(selected === key ? styles.optionKeySelected : {})
              }}>
                {key}
              </div>
              <span style={styles.optionText}>{value}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setCurrentQ(Math.max(0, currentQ - 1));
              setSelected('');
              setError('');
            }}
            disabled={currentQ === 0}
          >
            ← Back
          </button>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleNext}
            disabled={!selected}
          >
            {currentQ + 1 === questions.length ? 'Submit Quiz 🎯' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageTitle: {
    fontSize: '2.2rem',
    fontWeight: 800,
    marginBottom: '8px',
    letterSpacing: '-0.02em'
  },
  pageSubtitle: {
    fontSize: '1.1rem',
    color: 'var(--text-secondary)',
    marginBottom: '12px'
  },
  loadingCard: {
    padding: '60px 40px',
    textAlign: 'center',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid var(--border)',
    borderTopColor: 'var(--accent)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  errorCard: {
    padding: '60px 40px',
    textAlign: 'center',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  typeCard: {
    padding: '32px 24px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    borderRadius: '16px'
  },
  typeIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem'
  },
  typeTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.2rem',
    fontWeight: 700,
    margin: 0
  },
  typeDesc: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    lineHeight: 1.6,
    flex: 1,
    margin: '8px 0 0 0'
  },
  submittingCard: {
    padding: '60px 40px',
    textAlign: 'center',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  submitSpinner: {
    width: '64px',
    height: '64px',
    border: '4px solid var(--border)',
    borderTopColor: 'var(--accent)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  progressWrap: { marginBottom: '32px' },
  progressInfo: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  progressBar: { height: '6px', background: 'var(--bg-card)', borderRadius: '3px', overflow: 'hidden' },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    transition: 'width 0.4s ease'
  },
  questionCard: { padding: '48px', borderRadius: '24px' },
  qNumber: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '6px',
    background: 'rgba(124,111,255,0.15)',
    color: 'var(--accent)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '0.8rem',
    marginBottom: '16px'
  },
  questionText: { fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '32px' },
  optionsGrid: { display: 'flex', flexDirection: 'column', gap: '12px' },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: 'transparent'
  },
  optionSelected: {
    border: '1px solid var(--accent)',
    background: 'rgba(124,111,255,0.1)'
  },
  optionKey: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '0.9rem',
    flexShrink: 0,
    transition: 'all 0.2s ease'
  },
  optionKeySelected: { background: 'var(--accent)', color: '#fff' },
  optionText: { fontSize: '0.95rem', lineHeight: 1.5 }
};

export default Quiz;