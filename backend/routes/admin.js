// const express = require('express');
// const router = express.Router();
// const { getUsers, deleteUser, getStats, getAllAnalysis, createAdmin, getQuiz, createQuiz, updateQuiz, deleteQuiz } = require('../controllers/adminController');
// const { protect, adminOnly } = require('../middleware/auth');

// router.post('/create-admin', createAdmin); // Bootstrap only
// router.get('/stats', protect, adminOnly, getStats);
// router.get('/users', protect, adminOnly, getUsers);
// router.delete('/users/:id', protect, adminOnly, deleteUser);
// router.get('/analysis', protect, adminOnly, getAllAnalysis);
// router.get('/quiz', protect, adminOnly, getQuiz);
// router.post('/quiz', protect, adminOnly, createQuiz);
// router.put('/quiz/:id', protect, adminOnly, updateQuiz);
// router.delete('/quiz/:id', protect, adminOnly, deleteQuiz);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { 
  getAdminProfile,
  updateAdminProfile,
  updateAdminPassword,
  deleteAdminAccount,
  getUsers, 
  deleteUser, 
  getStats, 
  getAllAnalysis, 
  createAdmin,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN PROFILE ROUTES (All require admin authentication)
// ═══════════════════════════════════════════════════════════════════════════════

// @route   GET /api/admin/profile
// @desc    Get admin profile
// @access  Private (Admin only)
router.get('/profile', protect, authorize('admin'), getAdminProfile);

// @route   PUT /api/admin/profile
// @desc    Update admin profile (name, email)
// @access  Private (Admin only)
router.put('/profile', protect, authorize('admin'), updateAdminProfile);

// @route   PUT /api/admin/password
// @desc    Update admin password
// @access  Private (Admin only)
router.put('/password', protect, authorize('admin'), updateAdminPassword);

// @route   DELETE /api/admin/profile
// @desc    Delete admin account
// @access  Private (Admin only)
router.delete('/profile', protect, authorize('admin'), deleteAdminAccount);

// ═══════════════════════════════════════════════════════════════════════════════
// USER MANAGEMENT ROUTES (Admin only)
// ═══════════════════════════════════════════════════════════════════════════════

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', protect, authorize('admin'), getUsers);

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Private (Admin only)
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

// ═══════════════════════════════════════════════════════════════════════════════
// STATISTICS ROUTES (Admin only)
// ═══════════════════════════════════════════════════════════════════════════════

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get('/stats', protect, authorize('admin'), getStats);

// @route   GET /api/admin/analysis
// @desc    Get all analysis results
// @access  Private (Admin only)
router.get('/analysis', protect, authorize('admin'), getAllAnalysis);

// ═══════════════════════════════════════════════════════════════════════════════
// QUIZ MANAGEMENT ROUTES (Admin only)
// ═══════════════════════════════════════════════════════════════════════════════

// @route   GET /api/admin/quiz
// @desc    Get all quiz questions
// @access  Private (Admin only)
router.get('/quiz', protect, authorize('admin'), getQuiz);

// @route   POST /api/admin/quiz
// @desc    Create quiz question
// @access  Private (Admin only)
router.post('/quiz', protect, authorize('admin'), createQuiz);

// @route   PUT /api/admin/quiz/:id
// @desc    Update quiz question
// @access  Private (Admin only)
router.put('/quiz/:id', protect, authorize('admin'), updateQuiz);

// @route   DELETE /api/admin/quiz/:id
// @desc    Delete quiz question
// @access  Private (Admin only)
router.delete('/quiz/:id', protect, authorize('admin'), deleteQuiz);

// ═══════════════════════════════════════════════════════════════════════════════
// BOOTSTRAP ROUTE (No auth required, only works if no admin exists)
// ═══════════════════════════════════════════════════════════════════════════════

// @route   POST /api/admin/create-admin
// @desc    Create first admin (bootstrap)
// @access  Public (only if no admin exists)
router.post('/create-admin', createAdmin);

module.exports = router;