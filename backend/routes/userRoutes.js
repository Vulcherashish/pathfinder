const express = require('express');
const router = express.Router();
const { 
  getUserProfile, 
  updateUserProfile, 
  updateUserPassword, 
  deleteUserAccount 
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// ═══════════════════════════════════════════════════════════════════════════════
// USER PROFILE ROUTES (All require authentication)
// ═══════════════════════════════════════════════════════════════════════════════

// @route   GET /api/user/profile
// @desc    Get current user's profile
// @access  Private (Authenticated users only)
router.get('/profile', protect, getUserProfile);

// @route   PUT /api/user/profile
// @desc    Update user profile (name, email)
// @access  Private (Authenticated users only)
router.put('/profile', protect, updateUserProfile);

// @route   PUT /api/user/password
// @desc    Update user password
// @access  Private (Authenticated users only)
router.put('/password', protect, updateUserPassword);

// @route   DELETE /api/user/profile
// @desc    Delete user account
// @access  Private (Authenticated users only)
router.delete('/profile', protect, deleteUserAccount);

module.exports = router;