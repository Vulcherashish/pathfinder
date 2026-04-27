const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
router.get('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// @desc    Update logged-in user profile
// @route   PUT /api/users/profile
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: 'Profile updated!', data: user });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all users (admin)
// @route   GET /api/users
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, message: 'User deleted.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
