const AnalysisResult = require('../models/AnalysisResult');
const Job = require('../models/Job');
const College = require('../models/College');
const Quiz = require('../models/Quiz');

// ═══════════════════════════════════════════════════════════════════════════════
// CAREER DETERMINATION WITH CORRECT ANSWER SCORING
// ═══════════════════════════════════════════════════════════════════════════════

const determineCareer = (answers, quizType) => {
  let techScore = 0;
  let creativeScore = 0;
  let businessScore = 0;
  let analyticalScore = 0;
  let leadershipScore = 0;

  // Calculate scores based on CORRECT answers only
  answers.forEach(a => {
    // ✅ ONLY give points if user's answer is CORRECT
    if (a.isCorrect) {
      const val = parseInt(a.score) || 0;
      
      // Map answer to skill category
      if (a.answer === 'A') { 
        techScore += val; 
        analyticalScore += val * 0.5; 
      }
      else if (a.answer === 'B') { 
        creativeScore += val; 
      }
      else if (a.answer === 'C') { 
        businessScore += val; 
        leadershipScore += val * 0.5; 
      }
      else if (a.answer === 'D') { 
        analyticalScore += val; 
        techScore += val * 0.3; 
      }
    }
    // If answer is wrong, no points awarded
  });

  let career, description, skills;
  const total = techScore + creativeScore + businessScore || 1;

  // ✅ CAREER DETERMINATION (based on quiz type or highest score)
  if (quizType === 'tech' || techScore >= creativeScore && techScore >= businessScore) {
    career = 'Software Developer';
    description = 'You have a strong technical aptitude. You excel at problem-solving, logical thinking, and building software solutions. A career in software development suits you perfectly.';
    skills = ['JavaScript', 'Python', 'React', 'Node.js', 'Data Structures', 'Algorithms', 'Cloud Computing'];
  } else if (quizType === 'creative' || creativeScore >= techScore && creativeScore >= businessScore) {
    career = 'UI/UX Designer';
    description = 'You have a creative mind with great aesthetic sense. You understand user needs and can translate them into beautiful, functional interfaces. Design is your calling.';
    skills = ['Figma', 'Adobe XD', 'Photoshop', 'User Research', 'Prototyping', 'CSS', 'Motion Design'];
  } else {
    career = 'Business Manager';
    description = 'You are a natural leader with strong business acumen. You understand market dynamics and can lead teams toward strategic goals effectively.';
    skills = ['Leadership', 'Project Management', 'Communication', 'Strategic Planning', 'Data Analysis', 'Marketing'];
  }

  return {
    career,
    description,
    skills,
    scores: {
      tech: Math.round((techScore / total) * 100) || 0,
      creative: Math.round((creativeScore / total) * 100) || 0,
      business: Math.round((businessScore / total) * 100) || 0,
      analytical: Math.round((analyticalScore / total) * 100) || 0,
      leadership: Math.round((leadershipScore / total) * 100) || 0
    }
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUBMIT QUIZ WITH CORRECT ANSWER VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

// @desc    Submit quiz and get analysis
// @route   POST /api/analysis/submit
exports.submitQuiz = async (req, res, next) => {
  try {
    const { quizType, answers } = req.body;

    if (!answers || answers.length === 0) {
      return res.status(400).json({ success: false, message: 'Answers are required.' });
    }

    // ✅ FETCH CORRECT ANSWERS FROM DATABASE
    const questionIds = answers.map(a => a.questionId);
    const quizQuestions = await Quiz.find({ _id: { $in: questionIds } });

    // Create map of correct answers
    const correctAnswersMap = {};
    quizQuestions.forEach(q => {
      correctAnswersMap[q._id] = q.correctAnswer;
    });

    // ✅ COMPARE USER ANSWERS WITH CORRECT ANSWERS
    let correctCount = 0;
    let totalScore = 0;
    let maxPossibleScore = 0;

    const enhancedAnswers = answers.map(a => {
      const correctAnswer = correctAnswersMap[a.questionId];
      const isCorrect = a.answer === correctAnswer;
      const maxScore = a.score || 0; // Assuming all correct answers have same max score

      if (isCorrect) {
        correctCount++;
        totalScore += maxScore;
      }

      maxPossibleScore += maxScore;

      return {
        ...a,
        correctAnswer,      // ✅ Add correct answer
        isCorrect,          // ✅ Mark if correct
        maxScore            // ✅ Max possible score
      };
    });

    // Calculate accuracy percentage
    const accuracy = answers.length > 0 
      ? Math.round((correctCount / answers.length) * 100) 
      : 0;

    // ✅ DETERMINE CAREER BASED ON CORRECT ANSWERS
    const resultData = determineCareer(enhancedAnswers, quizType);

    // Find recommended jobs
    const careerKeyMap = {
      'Software Developer': 'developer',
      'UI/UX Designer': 'designer',
      'Business Manager': 'management'
    };
    const careerKey = careerKeyMap[resultData.career] || 'all';

    const jobs = await Job.find({
      $or: [{ careerPath: careerKey }, { careerPath: 'all' }]
    }).limit(6);

    const colleges = await College.find({
      $or: [{ careerPath: careerKey }, { careerPath: 'all' }]
    }).limit(6);

    resultData.recommendedJobs = jobs.map(j => j._id);
    resultData.recommendedColleges = colleges.map(c => c._id);

    // ✅ ADD ACCURACY METRICS TO RESULT
    resultData.totalQuestions = answers.length;
    resultData.correctAnswers = correctCount;
    resultData.wrongAnswers = answers.length - correctCount;
    resultData.accuracy = accuracy;
    resultData.totalScore = totalScore;
    resultData.maxPossibleScore = maxPossibleScore;

    // ✅ CREATE ANALYSIS RESULT WITH ENHANCED ANSWERS
    const analysis = await AnalysisResult.create({
      userId: req.user._id,
      quizType,
      answers: enhancedAnswers,  // ✅ Store enhanced answers with correctness
      result: resultData
    });

    // Populate recommended jobs and colleges
    const populated = await AnalysisResult.findById(analysis._id)
      .populate('result.recommendedJobs')
      .populate('result.recommendedColleges');

    res.status(201).json({ 
      success: true, 
      message: '✅ Quiz submitted successfully!',
      data: populated 
    });

  } catch (error) {
    console.error('Submit quiz error:', error);
    next(error);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// GET USER'S ANALYSIS HISTORY
// ═══════════════════════════════════════════════════════════════════════════════

// @desc    Get user's analysis history
// @route   GET /api/analysis/history
exports.getHistory = async (req, res, next) => {
  try {
    const results = await AnalysisResult.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('result.recommendedJobs', 'title salary')
      .populate('result.recommendedColleges', 'name location');

    res.json({ 
      success: true, 
      count: results.length, 
      data: results 
    });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// GET SINGLE ANALYSIS RESULT
// ═══════════════════════════════════════════════════════════════════════════════

// @desc    Get single analysis result
// @route   GET /api/analysis/:id
exports.getResult = async (req, res, next) => {
  try {
    const result = await AnalysisResult.findById(req.params.id)
      .populate('result.recommendedJobs')
      .populate('result.recommendedColleges');

    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found.' });
    }

    // ✅ AUTHORIZATION CHECK
    if (result.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};