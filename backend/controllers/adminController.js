
// const User = require('../models/User');
// const AnalysisResult = require('../models/AnalysisResult');
// const Job = require('../models/Job');
// const College = require('../models/College');
// const Quiz = require('../models/Quiz');

// // @desc    Get all users
// // @route   GET /api/admin/users
// exports.getUsers = async (req, res, next) => {
//   try {
//     const users = await User.find().sort({ createdAt: -1 });
//     res.json({ success: true, count: users.length, data: users });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Delete user
// // @route   DELETE /api/admin/users/:id
// exports.deleteUser = async (req, res, next) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found.' });
//     }
//     res.json({ success: true, message: 'User deleted!' });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get dashboard stats
// // @route   GET /api/admin/stats
// exports.getStats = async (req, res, next) => {
//   try {
//     const [totalUsers, totalJobs, totalColleges, totalAnalysis] = await Promise.all([
//       User.countDocuments({ role: 'user' }),
//       Job.countDocuments(),
//       College.countDocuments(),
//       AnalysisResult.countDocuments()
//     ]);

//     const recentUsers = await User.find({ role: 'user' }).sort({ createdAt: -1 }).limit(5);
//     const recentAnalysis = await AnalysisResult.find()
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate('userId', 'name email');

//     // Career distribution
//     const careerDist = await AnalysisResult.aggregate([
//       { $group: { _id: '$result.career', count: { $sum: 1 } } }
//     ]);

//     res.json({
//       success: true,
//       data: {
//         totalUsers,
//         totalJobs,
//         totalColleges,
//         totalAnalysis,
//         recentUsers,
//         recentAnalysis,
//         careerDistribution: careerDist
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get all analysis results (admin)
// // @route   GET /api/admin/analysis
// exports.getAllAnalysis = async (req, res, next) => {
//   try {
//     const results = await AnalysisResult.find()
//       .sort({ createdAt: -1 })
//       .populate('userId', 'name email');
//     res.json({ success: true, count: results.length, data: results });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Create admin user (bootstrap - only if no admin exists)
// // @route   POST /api/admin/create-admin
// exports.createAdmin = async (req, res, next) => {
//   try {
//     const adminExists = await User.findOne({ role: 'admin' });
//     if (adminExists) {
//       return res.status(400).json({ success: false, message: 'Admin already exists.' });
//     }

//     const admin = await User.create({
//       name: req.body.name || 'Admin',
//       email: req.body.email,
//       password: req.body.password,
//       role: 'admin'
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Admin created successfully!',
//       data: { name: admin.name, email: admin.email, role: admin.role }
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// // ═══════════════════════════════════════════════════════════════════════════════
// // QUIZ MANAGEMENT ENDPOINTS
// // ═══════════════════════════════════════════════════════════════════════════════

// // @desc Get all quiz questions
// // @route GET /api/admin/quiz
// exports.getQuiz = async (req, res, next) => {
//   try {
//     const quiz = await Quiz.find().sort({ createdAt: -1 });
//     res.json({ success: true, data: quiz });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc Create quiz question
// // @route POST /api/admin/quiz
// exports.createQuiz = async (req, res, next) => {
//   try {
//     const { question, options, scores, quizType, correctAnswer } = req.body;

//     // ✅ VALIDATION
//     if (!quizType) {
//       return res.status(400).json({ message: 'Quiz type is required' });
//     }

//     if (!question || !options || options.length === 0) {
//       return res.status(400).json({ message: 'Question & options required' });
//     }

//     if (options.length !== scores.length) {
//       return res.status(400).json({ message: 'Options & scores mismatch' });
//     }

//     if (!correctAnswer) {
//       return res.status(400).json({ message: 'Correct answer is required' });
//     }

//     // Validate correctAnswer is a valid index
//     const answerIndex = correctAnswer.charCodeAt(0) - 65; // A=0, B=1, C=2...
//     if (answerIndex < 0 || answerIndex >= options.length) {
//       return res.status(400).json({ message: `Invalid correct answer. Must be between A-${String.fromCharCode(64 + options.length)}` });
//     }

//     // ✅ CREATE QUIZ
//     const quiz = await Quiz.create({
//       question,
//       options,
//       scores,
//       quizType,
//       correctAnswer  // ✅ SAVE CORRECT ANSWER
//     });

//     res.status(201).json({ 
//       success: true, 
//       message: '✅ Quiz question created successfully!',
//       data: quiz 
//     });

//   } catch (error) {
//     next(error);
//   }
// };

// // @desc Update quiz question
// // @route PUT /api/admin/quiz/:id
// exports.updateQuiz = async (req, res, next) => {
//   try {
//     const { question, options, scores, quizType, correctAnswer } = req.body;

//     // ✅ VALIDATION (same as create)
//     if (quizType && !['tech', 'creative', 'business'].includes(quizType)) {
//       return res.status(400).json({ message: 'Invalid quiz type' });
//     }

//     if (options && scores && options.length !== scores.length) {
//       return res.status(400).json({ message: 'Options & scores mismatch' });
//     }

//     if (correctAnswer) {
//       const answerIndex = correctAnswer.charCodeAt(0) - 65;
//       const optionsCount = options?.length || 3;
//       if (answerIndex < 0 || answerIndex >= optionsCount) {
//         return res.status(400).json({ message: 'Invalid correct answer' });
//       }
//     }

//     // ✅ UPDATE
//     const quiz = await Quiz.findByIdAndUpdate(
//       req.params.id, 
//       req.body, 
//       { new: true, runValidators: true }
//     );

//     if (!quiz) {
//       return res.status(404).json({ success: false, message: 'Quiz not found' });
//     }

//     res.json({ 
//       success: true, 
//       message: '✅ Quiz updated successfully!',
//       data: quiz 
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc Delete quiz question
// // @route DELETE /api/admin/quiz/:id
// exports.deleteQuiz = async (req, res, next) => {
//   try {
//     const quiz = await Quiz.findByIdAndDelete(req.params.id);
//     if (!quiz) {
//       return res.status(404).json({ success: false, message: 'Quiz not found' });
//     }
//     res.json({ 
//       success: true, 
//       message: '✅ Quiz deleted successfully!' 
//     });
//   } catch (error) {
//     next(error);
//   }
// };
const User = require('../models/User');
const AnalysisResult = require('../models/AnalysisResult');
const Job = require('../models/Job');
const College = require('../models/College');
const Quiz = require('../models/Quiz');
const bcrypt = require('bcryptjs');

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN PROFILE ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private (Admin)
exports.getAdminProfile = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user._id).select('-password');
    res.json({ success: true, data: admin });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admin profile (name, email)
// @route   PUT /api/admin/profile
// @access  Private (Admin)
exports.updateAdminProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    // ✅ VALIDATION
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Check if email already exists (excluding current user)
    const existingEmail = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    // ✅ UPDATE
    const admin = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim(), email: email.trim() },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: admin
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admin password
// @route   PUT /api/admin/password
// @access  Private (Admin)
exports.updateAdminPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // ✅ VALIDATION
    if (!currentPassword) {
      return res.status(400).json({ success: false, message: 'Current password is required' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    if (newPassword === currentPassword) {
      return res.status(400).json({ success: false, message: 'New password must be different from current password' });
    }

    // Get admin with password
    // const admin = await User.findById(req.user._id);
    const admin = await User.findById(req.user._id).select('+password');
    if (!admin || !admin.password) {
      return res.status(500).json({
        success: false,
        message: 'Admin password not found'
      });
    }
    // ✅ VERIFY CURRENT PASSWORD
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // ✅ HASH NEW PASSWORD
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);

    // ✅ SAVE
    await admin.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete admin account
// @route   DELETE /api/admin/profile
// @access  Private (Admin)
exports.deleteAdminAccount = async (req, res, next) => {
  try {
    // ✅ Check if this is the last admin
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount <= 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete the last admin. Create another admin first.' 
      });
    }

    // ✅ DELETE ADMIN
    await User.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: 'Admin account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// USER MANAGEMENT ENDPOINTS (Original)
// ═══════════════════════════════════════════════════════════════════════════════

// @desc    Get all users
// @route   GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, message: 'User deleted!' });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD STATISTICS
// ═══════════════════════════════════════════════════════════════════════════════

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
exports.getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalJobs, totalColleges, totalAnalysis] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Job.countDocuments(),
      College.countDocuments(),
      AnalysisResult.countDocuments()
    ]);

    const recentUsers = await User.find({ role: 'user' }).sort({ createdAt: -1 }).limit(5);
    const recentAnalysis = await AnalysisResult.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');

    // Career distribution
    const careerDist = await AnalysisResult.aggregate([
      { $group: { _id: '$result.career', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalJobs,
        totalColleges,
        totalAnalysis,
        recentUsers,
        recentAnalysis,
        careerDistribution: careerDist
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all analysis results (admin)
// @route   GET /api/admin/analysis
exports.getAllAnalysis = async (req, res, next) => {
  try {
    const results = await AnalysisResult.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    next(error);
  }
};

// @desc    Create admin user (bootstrap - only if no admin exists)
// @route   POST /api/admin/create-admin
exports.createAdmin = async (req, res, next) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(400).json({ success: false, message: 'Admin already exists.' });
    }

    const admin = await User.create({
      name: req.body.name || 'Admin',
      email: req.body.email,
      password: req.body.password,
      role: 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully!',
      data: { name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// QUIZ MANAGEMENT ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

// @desc Get all quiz questions
exports.getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.find().sort({ createdAt: -1 });
    res.json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

// @desc Create quiz question
exports.createQuiz = async (req, res, next) => {
  try {
    const { question, options, scores, quizType, correctAnswer } = req.body;

    if (!quizType) {
      return res.status(400).json({ message: 'Quiz type is required' });
    }

    if (!question || !options.length) {
      return res.status(400).json({ message: 'Question & options required' });
    }

    if (options.length !== scores.length) {
      return res.status(400).json({ message: 'Options & scores mismatch' });
    }

    if (!correctAnswer) {
      return res.status(400).json({ message: 'Correct answer is required' });
    }

    const answerIndex = correctAnswer.charCodeAt(0) - 65;
    if (answerIndex < 0 || answerIndex >= options.length) {
      return res.status(400).json({ message: `Invalid correct answer. Must be between A-${String.fromCharCode(64 + options.length)}` });
    }

    const quiz = await Quiz.create({
      question,
      options,
      scores,
      quizType,
      correctAnswer
    });

    res.status(201).json({ 
      success: true, 
      message: '✅ Quiz question created successfully!',
      data: quiz 
    });

  } catch (error) {
    next(error);
  }
};

// @desc Update quiz question
exports.updateQuiz = async (req, res, next) => {
  try {
    const { question, options, scores, quizType, correctAnswer } = req.body;

    if (quizType && !['tech', 'creative', 'business'].includes(quizType)) {
      return res.status(400).json({ message: 'Invalid quiz type' });
    }

    if (options && scores && options.length !== scores.length) {
      return res.status(400).json({ message: 'Options & scores mismatch' });
    }

    if (correctAnswer) {
      const answerIndex = correctAnswer.charCodeAt(0) - 65;
      const optionsCount = options?.length || 3;
      if (answerIndex < 0 || answerIndex >= optionsCount) {
        return res.status(400).json({ message: 'Invalid correct answer' });
      }
    }

    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    res.json({ 
      success: true, 
      message: '✅ Quiz updated successfully!',
      data: quiz 
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete quiz question
exports.deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }
    res.json({ 
      success: true, 
      message: '✅ Quiz deleted successfully!' 
    });
  } catch (error) {
    next(error);
  }
};