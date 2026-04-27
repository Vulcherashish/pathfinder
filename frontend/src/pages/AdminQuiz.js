
// import React, { useState, useEffect } from 'react';
// import API from '../utils/api';

// const defaultForm = {
//   quizType: 'tech',
//   question: '',
//   options: ['', '', ''],  // Start with 3 options
//   scores: [1, 1, 1]
// };

// const AdminQuiz = () => {
//   const [quiz, setQuiz] = useState([]);
//   const [form, setForm] = useState(defaultForm);
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   // ✅ FETCH ALL QUIZZES
//   const fetchQuiz = async () => {
//     try {
//       setLoading(true);
//       const { data } = await API.get('/admin/quiz');
//       setQuiz(data.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Failed to fetch quiz:', error);
//       setMessage('❌ Failed to load quizzes');
//       setLoading(false);
//     }
//   };

//   useEffect(() => { 
//     fetchQuiz(); 
//   }, []);

//   // ✅ CREATE/UPDATE QUIZ
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');

//     // Validation
//     if (!form.question.trim()) {
//       setMessage('⚠️ Question is required');
//       return;
//     }

//     if (form.options.some(opt => !opt.trim())) {
//       setMessage('⚠️ All options must be filled');
//       return;
//     }

//     try {
//       setLoading(true);

//       if (editId) {
//         // UPDATE
//         await API.put(`/admin/quiz/${editId}`, form);
//         setMessage('✅ Quiz updated successfully!');
//       } else {
//         // CREATE
//         await API.post('/admin/quiz', form);
//         setMessage('✅ Quiz added successfully!');
//       }

//       setForm(defaultForm);
//       setEditId(null);
//       fetchQuiz();
//       setLoading(false);
//     } catch (error) {
//       console.error('Submit error:', error);
//       setMessage(`❌ ${error.response?.data?.message || 'Operation failed'}`);
//       setLoading(false);
//     }
//   };

//   // ✅ EDIT QUIZ
//   const handleEdit = (q) => {
//     setForm({
//       quizType: q.quizType,
//       question: q.question,
//       options: q.options || [''],
//       scores: q.scores || [1]
//     });
//     setEditId(q._id);
//     setMessage('');
//     // Scroll to form
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // ✅ DELETE QUIZ
//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this quiz?')) {
//       return;
//     }

//     try {
//       setLoading(true);
//       await API.delete(`/admin/quiz/${id}`);
//       setMessage('✅ Quiz deleted successfully!');
//       fetchQuiz();
//       setLoading(false);
//     } catch (error) {
//       console.error('Delete error:', error);
//       setMessage(`❌ ${error.response?.data?.message || 'Failed to delete'}`);
//       setLoading(false);
//     }
//   };

//   // ✅ CANCEL EDIT
//   const handleCancel = () => {
//     setForm(defaultForm);
//     setEditId(null);
//     setMessage('');
//   };

//   // ✅ OPTION HANDLERS
//   const handleOptionChange = (index, value) => {
//     const newOptions = [...form.options];
//     newOptions[index] = value;
//     setForm({ ...form, options: newOptions });
//   };

//   const handleScoreChange = (index, value) => {
//     const newScores = [...form.scores];
//     newScores[index] = Number(value) || 0;
//     setForm({ ...form, scores: newScores });
//   };

//   const addOption = () => {
//     setForm({
//       ...form,
//       options: [...form.options, ''],
//       scores: [...form.scores, 1]
//     });
//   };

//   const removeOption = (index) => {
//     if (form.options.length <= 2) {
//       setMessage('⚠️ Quiz must have at least 2 options');
//       return;
//     }

//     const newOptions = form.options.filter((_, i) => i !== index);
//     const newScores = form.scores.filter((_, i) => i !== index);

//     setForm({
//       ...form,
//       options: newOptions,
//       scores: newScores
//     });
//   };

//   // ✅ GET CAREER TYPE COLOR
//   const getTypeColor = (type) => {
//     const colors = {
//       tech: '#7c6fff',
//       creative: '#f5576c',
//       business: '#00f2fe'
//     };
//     return colors[type] || '#888';
//   };

//   return (
//     <div className="page" style={{ maxWidth: '1000px', margin: '0 auto' }}>
//       <h1 className="page-title">📝 Manage Quiz Questions</h1>

//       {/* ════════════════════════════════════════════════════════════════ */}
//       {/* MESSAGE/ALERT */}
//       {/* ════════════════════════════════════════════════════════════════ */}
//       {message && (
//         <div style={{
//           padding: '16px',
//           borderRadius: '8px',
//           marginBottom: '24px',
//           background: message.includes('✅') ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)',
//           border: `1px solid ${message.includes('✅') ? '#4caf50' : '#f44336'}`,
//           color: message.includes('✅') ? '#2e7d32' : '#c62828'
//         }}>
//           {message}
//         </div>
//       )}

//       {/* ════════════════════════════════════════════════════════════════ */}
//       {/* FORM - CREATE/EDIT QUIZ */}
//       {/* ════════════════════════════════════════════════════════════════ */}
//       <form onSubmit={handleSubmit} className="glass" style={{ padding: '32px', marginBottom: '40px' }}>
//         <h2 style={{ marginBottom: '24px', fontSize: '1.3rem', fontWeight: 700 }}>
//           {editId ? '✏️ Edit Quiz Question' : '➕ Add New Quiz Question'}
//         </h2>

//         {/* Question */}
//         <div className="form-group" style={{ marginBottom: '20px' }}>
//           <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
//             Question
//           </label>
//           <input
//             className="form-input"
//             placeholder="Enter question text..."
//             value={form.question}
//             onChange={e => setForm({ ...form, question: e.target.value })}
//             style={{
//               width: '100%',
//               padding: '12px',
//               border: '1px solid var(--border)',
//               borderRadius: '8px',
//               fontSize: '1rem'
//             }}
//           />
//         </div>

//         {/* Quiz Type */}
//         <div className="form-group" style={{ marginBottom: '20px' }}>
//           <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
//             Career Track
//           </label>
//           <select
//             className="form-select"
//             value={form.quizType}
//             onChange={(e) => setForm({ ...form, quizType: e.target.value })}
//             style={{
//               width: '100%',
//               padding: '12px',
//               border: '1px solid var(--border)',
//               borderRadius: '8px',
//               fontSize: '1rem'
//             }}
//           >
//             <option value="tech">💻 Technology</option>
//             <option value="creative">🎨 Creative</option>
//             <option value="business">📊 Business</option>
//           </select>
//         </div>

//         {/* Options */}
//         <div className="form-group" style={{ marginBottom: '20px' }}>
//           <label className="form-label" style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>
//             Answer Options & Scores
//           </label>

//           {form.options.map((opt, index) => (
//             <div key={index} style={{
//               display: 'flex',
//               gap: '12px',
//               marginBottom: '12px',
//               alignItems: 'center'
//             }}>
//               {/* Option Letter */}
//               <div style={{
//                 width: '40px',
//                 height: '40px',
//                 background: 'var(--accent)',
//                 borderRadius: '8px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 color: '#fff',
//                 fontWeight: 700,
//                 flexShrink: 0
//               }}>
//                 {String.fromCharCode(65 + index)}
//               </div>

//               {/* Option Text */}
//               <input
//                 className="form-input"
//                 placeholder={`Option ${String.fromCharCode(65 + index)}`}
//                 value={opt}
//                 onChange={(e) => handleOptionChange(index, e.target.value)}
//                 style={{
//                   flex: 1,
//                   padding: '12px',
//                   border: '1px solid var(--border)',
//                   borderRadius: '8px'
//                 }}
//               />

//               {/* Score */}
//               <input
//                 className="form-input"
//                 type="number"
//                 placeholder="Score"
//                 value={form.scores[index]}
//                 onChange={(e) => handleScoreChange(index, e.target.value)}
//                 style={{
//                   width: '80px',
//                   padding: '12px',
//                   border: '1px solid var(--border)',
//                   borderRadius: '8px'
//                 }}
//                 min="0"
//               />

//               {/* Delete Button */}
//               <button
//                 type="button"
//                 className="btn btn-danger btn-sm"
//                 onClick={() => removeOption(index)}
//                 style={{ padding: '10px 12px' }}
//               >
//                 ❌
//               </button>
//             </div>
//           ))}

//           {/* Add Option Button */}
//           <button
//             type="button"
//             className="btn btn-secondary btn-sm"
//             onClick={addOption}
//             style={{ marginTop: '12px' }}
//           >
//             ➕ Add Option
//           </button>
//         </div>

//         {/* Submit Buttons */}
//         <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
//           <button
//             type="submit"
//             className="btn btn-primary"
//             disabled={loading}
//             style={{ flex: 1 }}
//           >
//             {loading ? '⏳ Saving...' : editId ? '💾 Update Quiz' : '➕ Add Quiz'}
//           </button>

//           {editId && (
//             <button
//               type="button"
//               className="btn btn-secondary"
//               onClick={handleCancel}
//               disabled={loading}
//             >
//               ✕ Cancel
//             </button>
//           )}
//         </div>
//       </form>

//       {/* ════════════════════════════════════════════════════════════════ */}
//       {/* QUIZ LIST - DISPLAY ALL QUIZZES */}
//       {/* ════════════════════════════════════════════════════════════════ */}
//       <div>
//         <h2 style={{ marginBottom: '20px', fontSize: '1.3rem', fontWeight: 700 }}>
//           📋 Quiz Questions ({quiz.length})
//         </h2>

//         {loading && !quiz.length ? (
//           <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
//             <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
//             <p>Loading quizzes...</p>
//           </div>
//         ) : quiz.length === 0 ? (
//           <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
//             <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📝</div>
//             <p>No quizzes yet. Create your first question above!</p>
//           </div>
//         ) : (
//           <div style={{ display: 'grid', gap: '16px' }}>
//             {quiz.map((q) => (
//               <div
//                 key={q._id}
//                 className="glass"
//                 style={{
//                   padding: '24px',
//                   borderLeft: `4px solid ${getTypeColor(q.quizType)}`,
//                   display: 'flex',
//                   flexDirection: 'column',
//                   gap: '12px'
//                 }}
//               >
//                 {/* Header */}
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                   <div style={{ flex: 1 }}>
//                     <div style={{
//                       display: 'inline-block',
//                       background: getTypeColor(q.quizType),
//                       color: '#fff',
//                       padding: '4px 12px',
//                       borderRadius: '6px',
//                       fontSize: '0.75rem',
//                       fontWeight: 700,
//                       marginBottom: '8px'
//                     }}>
//                       {q.quizType.toUpperCase()}
//                     </div>
//                     <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 700 }}>
//                       {q.question}
//                     </h3>
//                   </div>
//                 </div>

//                 {/* Options */}
//                 <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
//                   {q.options.map((opt, idx) => (
//                     <div
//                       key={idx}
//                       style={{
//                         display: 'flex',
//                         gap: '12px',
//                         padding: '8px 0',
//                         borderBottom: idx < q.options.length - 1 ? '1px solid var(--border)' : 'none'
//                       }}
//                     >
//                       <span style={{
//                         fontWeight: 700,
//                         color: 'var(--accent)',
//                         minWidth: '20px'
//                       }}>
//                         {String.fromCharCode(65 + idx)}:
//                       </span>
//                       <span style={{ flex: 1 }}>{opt}</span>
//                       <span style={{
//                         background: getTypeColor(q.quizType),
//                         color: '#fff',
//                         padding: '2px 8px',
//                         borderRadius: '4px',
//                         fontSize: '0.85rem',
//                         fontWeight: 600
//                       }}>
//                         +{q.scores[idx]}
//                       </span>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Actions */}
//                 <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
//                   <button
//                     className="btn btn-secondary btn-sm"
//                     onClick={() => handleEdit(q)}
//                     disabled={loading}
//                     style={{ flex: 1 }}
//                   >
//                     ✏️ Edit
//                   </button>
//                   <button
//                     className="btn btn-danger btn-sm"
//                     onClick={() => handleDelete(q._id)}
//                     disabled={loading}
//                     style={{ flex: 1 }}
//                   >
//                     🗑️ Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminQuiz;

import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const defaultForm = {
  quizType: 'tech',
  question: '',
  options: ['', '', ''],  // Start with 3 options
  scores: [1, 1, 1],
  correctAnswer: 'A'      // ✅ NEW: Correct answer field
};

const AdminQuiz = () => {
  const [quiz, setQuiz] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // ✅ FETCH ALL QUIZZES
  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/quiz');
      setQuiz(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch quiz:', error);
      setMessage('❌ Failed to load quizzes');
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchQuiz(); 
  }, []);

  // ✅ CREATE/UPDATE QUIZ
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validation
    if (!form.question.trim()) {
      setMessage('⚠️ Question is required');
      return;
    }

    if (form.options.some(opt => !opt.trim())) {
      setMessage('⚠️ All options must be filled');
      return;
    }

    // ✅ NEW: Validate correct answer
    if (!form.correctAnswer) {
      setMessage('⚠️ Please select the correct answer');
      return;
    }

    const answerIndex = form.correctAnswer.charCodeAt(0) - 65;
    if (answerIndex < 0 || answerIndex >= form.options.length) {
      setMessage('⚠️ Correct answer must match an available option');
      return;
    }

    try {
      setLoading(true);

      if (editId) {
        // UPDATE
        await API.put(`/admin/quiz/${editId}`, form);
        setMessage('✅ Quiz updated successfully!');
      } else {
        // CREATE
        await API.post('/admin/quiz', form);
        setMessage('✅ Quiz added successfully!');
      }

      setForm(defaultForm);
      setEditId(null);
      fetchQuiz();
      setLoading(false);
    } catch (error) {
      console.error('Submit error:', error);
      setMessage(`❌ ${error.response?.data?.message || 'Operation failed'}`);
      setLoading(false);
    }
  };

  // ✅ EDIT QUIZ
  const handleEdit = (q) => {
    setForm({
      quizType: q.quizType,
      question: q.question,
      options: q.options || [''],
      scores: q.scores || [1],
      correctAnswer: q.correctAnswer || 'A'  // ✅ Load correct answer
    });
    setEditId(q._id);
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ DELETE QUIZ
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    try {
      setLoading(true);
      await API.delete(`/admin/quiz/${id}`);
      setMessage('✅ Quiz deleted successfully!');
      fetchQuiz();
      setLoading(false);
    } catch (error) {
      console.error('Delete error:', error);
      setMessage(`❌ ${error.response?.data?.message || 'Failed to delete'}`);
      setLoading(false);
    }
  };

  // ✅ CANCEL EDIT
  const handleCancel = () => {
    setForm(defaultForm);
    setEditId(null);
    setMessage('');
  };

  // ✅ OPTION HANDLERS
  const handleOptionChange = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  const handleScoreChange = (index, value) => {
    const newScores = [...form.scores];
    newScores[index] = Number(value) || 0;
    setForm({ ...form, scores: newScores });
  };

  const addOption = () => {
    setForm({
      ...form,
      options: [...form.options, ''],
      scores: [...form.scores, 1]
    });
  };

  const removeOption = (index) => {
    if (form.options.length <= 2) {
      setMessage('⚠️ Quiz must have at least 2 options');
      return;
    }

    const newOptions = form.options.filter((_, i) => i !== index);
    const newScores = form.scores.filter((_, i) => i !== index);

    // ✅ If deleted option was the correct answer, reset to A
    const deletedAnswerChar = String.fromCharCode(65 + index);
    let newCorrectAnswer = form.correctAnswer;
    if (deletedAnswerChar === form.correctAnswer) {
      newCorrectAnswer = 'A';
    }

    setForm({
      ...form,
      options: newOptions,
      scores: newScores,
      correctAnswer: newCorrectAnswer
    });
  };

  // ✅ GET CAREER TYPE COLOR
  const getTypeColor = (type) => {
    const colors = {
      tech: '#7c6fff',
      creative: '#f5576c',
      business: '#00f2fe'
    };
    return colors[type] || '#888';
  };

  return (
    <div className="page" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="page-title">📝 Manage Quiz Questions</h1>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* MESSAGE/ALERT */}
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
      {/* FORM - CREATE/EDIT QUIZ */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <form onSubmit={handleSubmit} className="glass" style={{ padding: '32px', marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '24px', fontSize: '1.3rem', fontWeight: 700 }}>
          {editId ? '✏️ Edit Quiz Question' : '➕ Add New Quiz Question'}
        </h2>

        {/* Question */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Question
          </label>
          <input
            className="form-input"
            placeholder="Enter question text..."
            value={form.question}
            onChange={e => setForm({ ...form, question: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>

        {/* Quiz Type */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Career Track
          </label>
          <select
            className="form-select"
            value={form.quizType}
            onChange={(e) => setForm({ ...form, quizType: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          >
            <option value="tech">💻 Technology</option>
            <option value="creative">🎨 Creative</option>
            <option value="business">📊 Business</option>
          </select>
        </div>

        {/* Options */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>
            Answer Options & Scores
          </label>

          {form.options.map((opt, index) => (
            <div key={index} style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '12px',
              alignItems: 'center'
            }}>
              {/* Option Letter */}
              <div style={{
                width: '40px',
                height: '40px',
                background: 'var(--accent)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                flexShrink: 0
              }}>
                {String.fromCharCode(65 + index)}
              </div>

              {/* Option Text */}
              <input
                className="form-input"
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
              />

              {/* Score */}
              <input
                className="form-input"
                type="number"
                placeholder="Score"
                value={form.scores[index]}
                onChange={(e) => handleScoreChange(index, e.target.value)}
                style={{
                  width: '80px',
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
                min="0"
              />

              {/* ✅ NEW: Correct Answer Radio */}
              <input
                type="radio"
                name="correctAnswer"
                value={String.fromCharCode(65 + index)}
                checked={form.correctAnswer === String.fromCharCode(65 + index)}
                onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
                title="Mark as correct answer"
              />

              {/* Delete Button */}
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => removeOption(index)}
                style={{ padding: '10px 12px' }}
              >
                ❌
              </button>
            </div>
          ))}

          {/* ✅ NEW: Correct Answer Indicator */}
          <div style={{
            marginTop: '12px',
            padding: '12px',
            background: 'rgba(76,175,80,0.1)',
            border: '1px solid #4caf50',
            borderRadius: '8px',
            color: '#2e7d32',
            fontSize: '0.9rem',
            fontWeight: 600
          }}>
            ✅ Correct Answer: <strong>{form.correctAnswer}</strong>
          </div>

          {/* Add Option Button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={addOption}
            style={{ marginTop: '12px' }}
          >
            ➕ Add Option
          </button>
        </div>

        {/* Submit Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? '⏳ Saving...' : editId ? '💾 Update Quiz' : '➕ Add Quiz'}
          </button>

          {editId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              ✕ Cancel
            </button>
          )}
        </div>
      </form>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* QUIZ LIST - DISPLAY ALL QUIZZES */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div>
        <h2 style={{ marginBottom: '20px', fontSize: '1.3rem', fontWeight: 700 }}>
          📋 Quiz Questions ({quiz.length})
        </h2>

        {loading && !quiz.length ? (
          <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
            <p>Loading quizzes...</p>
          </div>
        ) : quiz.length === 0 ? (
          <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📝</div>
            <p>No quizzes yet. Create your first question above!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {quiz.map((q) => (
              <div
                key={q._id}
                className="glass"
                style={{
                  padding: '24px',
                  borderLeft: `4px solid ${getTypeColor(q.quizType)}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'inline-block',
                      background: getTypeColor(q.quizType),
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      marginBottom: '8px'
                    }}>
                      {q.quizType.toUpperCase()}
                    </div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 700 }}>
                      {q.question}
                    </h3>
                  </div>
                </div>

                {/* Options */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                  {q.options.map((opt, idx) => {
                    const optionKey = String.fromCharCode(65 + idx);
                    const isCorrect = optionKey === q.correctAnswer;
                    
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          gap: '12px',
                          padding: '8px 0',
                          borderBottom: idx < q.options.length - 1 ? '1px solid var(--border)' : 'none',
                          background: isCorrect ? 'rgba(76,175,80,0.05)' : 'transparent',
                          paddingLeft: '8px',
                          borderRadius: '4px'
                        }}
                      >
                        <span style={{
                          fontWeight: 700,
                          color: 'var(--accent)',
                          minWidth: '20px'
                        }}>
                          {optionKey}:
                        </span>
                        <span style={{ flex: 1 }}>{opt}</span>
                        <span style={{
                          background: getTypeColor(q.quizType),
                          color: '#fff',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}>
                          +{q.scores[idx]}
                        </span>
                        {/* ✅ NEW: Show correct answer indicator */}
                        {isCorrect && (
                          <span style={{
                            background: '#4caf50',
                            color: '#fff',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}>
                            ✓ CORRECT
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleEdit(q)}
                    disabled={loading}
                    style={{ flex: 1 }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(q._id)}
                    disabled={loading}
                    style={{ flex: 1 }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQuiz;