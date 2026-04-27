// const mongoose = require('mongoose');

// const analysisResultSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   quizType: {
//     type: String,
//     enum: ['tech', 'creative', 'business'],
//     required: true
//   },
//   answers: [
//     {
//       questionId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Quiz'
//       },
//       question: String,
//       answer: String,
//       score: Number
//     }
//   ],
//   result: {
//     career: {
//       type: String,
//       required: true
//     },
//     description: String,
//     skills: [String],
//     scores: {
//       tech: { type: Number, default: 0 },
//       creative: { type: Number, default: 0 },
//       business: { type: Number, default: 0 },
//       analytical: { type: Number, default: 0 },
//       leadership: { type: Number, default: 0 }
//     },
//     recommendedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
//     recommendedColleges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'College' }]
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('AnalysisResult', analysisResultSchema);
const mongoose = require('mongoose');

const analysisResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizType: {
    type: String,
    enum: ['tech', 'creative', 'business'],
    required: true
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
      },
      question: String,
      answer: String,              // User's selected answer (A, B, C, etc.)
      correctAnswer: String,       // ✅ NEW: Correct answer
      isCorrect: Boolean,          // ✅ NEW: Whether user answered correctly
      score: Number,               // Points for this answer
      maxScore: Number             // ✅ NEW: Maximum possible score for this question
    }
  ],
  result: {
    career: {
      type: String,
      required: true
    },
    description: String,
    skills: [String],
    scores: {
      tech: { type: Number, default: 0 },
      creative: { type: Number, default: 0 },
      business: { type: Number, default: 0 },
      analytical: { type: Number, default: 0 },
      leadership: { type: Number, default: 0 }
    },
    // ✅ NEW FIELDS: Answer accuracy
    totalQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    wrongAnswers: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },  // Percentage
    totalScore: { type: Number, default: 0 },
    maxPossibleScore: { type: Number, default: 0 },
    
    recommendedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    recommendedColleges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'College' }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AnalysisResult', analysisResultSchema);