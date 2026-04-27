// const express = require('express');
// const router = express.Router();
// const Quiz = require('../models/Quiz');
// const { protect } = require('../middleware/auth');

// // GET quiz for users
// router.get('/', protect, async (req, res) => {
//   try {
//     const quiz = await Quiz.find();

//     const formatted = {
//       tech: [],
//       creative: [],
//       business: []
//     };

//     quiz.forEach(q => {
//       // ✅ Convert ARRAY → OBJECT (A, B, C...)
//       const optionsObj = {};
//       const scoresObj = {};

//       q.options.forEach((opt, index) => {
//         const key = String.fromCharCode(65 + index); // A, B, C...
//         optionsObj[key] = opt;
//         scoresObj[key] = q.scores[index];
//       });

//       formatted[q.quizType].push({
//         _id: q._id,
//         question: q.question,
//         options: optionsObj,   // ✅ FIXED
//         scores: scoresObj      // ✅ FIXED
//       });
//     });

//     res.json({ success: true, data: formatted });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// module.exports = router;
// File: routes/quiz.js
// This is the PUBLIC quiz route for users to fetch quiz questions
// This is SEPARATE from admin CRUD routes

const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const { protect } = require('../middleware/auth');

/**
 * @desc    Get all quiz questions formatted for frontend
 * @route   GET /api/quiz
 * @access  Private (requires auth)
 */
router.get('/', protect, async (req, res) => {
  try {
    // Fetch all quiz questions from MongoDB
    const quiz = await Quiz.find().sort({ createdAt: -1 });

    // Check if any quizzes exist
    if (!quiz || quiz.length === 0) {
      return res.json({
        success: true,
        data: {
          tech: [],
          creative: [],
          business: []
        }
      });
    }

    // Convert database format (arrays) → frontend format (objects with A, B, C keys)
    const formatted = {
      tech: [],
      creative: [],
      business: []
    };

    quiz.forEach(q => {
      // Create option object: { A: "Option 1", B: "Option 2", ... }
      const optionsObj = {};
      const scoresObj = {};

      q.options.forEach((opt, index) => {
        const key = String.fromCharCode(65 + index); // Converts 0→A, 1→B, 2→C, etc.
        optionsObj[key] = opt;
        scoresObj[key] = q.scores[index];
      });

      // Push formatted question
      formatted[q.quizType].push({
        _id: q._id,
        id: q._id,  // ✅ CRITICAL: Frontend uses question.id in handleNext()
        question: q.question,
        options: optionsObj,    // { A: "...", B: "...", C: "..." }
        scores: scoresObj,      // { A: 10, B: 5, C: 3 }
        quizType: q.quizType
      });
    });

    res.json({
      success: true,
      data: formatted
    });

  } catch (err) {
    console.error('Quiz fetch error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch quiz'
    });
  }
});

module.exports = router;