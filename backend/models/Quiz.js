
// const mongoose = require('mongoose');

// const quizSchema = new mongoose.Schema({
//   quizType: {
//     type: String,
//     enum: ['tech', 'creative', 'business'],
//     required: true
//   },
//   question: {
//     type: String,
//     required: true
//   },
//   options: {
//     type: [String],   // ✅ FIXED
//     required: true
//   },
//   scores: {
//     type: [Number],   // ✅ FIXED
//     required: true
//   }
// }, { timestamps: true,
//     collection: 'quiz'
//  });

// module.exports = mongoose.model('Quiz', quizSchema, 'quiz');
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  quizType: {
    type: String,
    enum: ['tech', 'creative', 'business'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],   
    required: true
  },
  scores: {
    type: [Number],   
    required: true
  },
  correctAnswer: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'E', 'F'],  // Support up to 6 options
    required: true,
    description: 'The correct answer option (A, B, C, etc.)'
  }
}, { 
  timestamps: true,
  collection: 'quiz'
});

module.exports = mongoose.model('Quiz', quizSchema, 'quiz');