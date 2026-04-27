const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ═══════════════════════════════════════════════════════════════════════════════
// USER PROFILE ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private (User)
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile (name, email)
// @route   PUT /api/user/profile
// @access  Private (User)
exports.updateUserProfile = async (req, res, next) => {
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
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim(), email: email.trim() },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user password
// @route   PUT /api/user/password
// @access  Private (User)
// exports.updateUserPassword = async (req, res, next) => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     // ✅ VALIDATION
//     if (!currentPassword) {
//       return res.status(400).json({ success: false, message: 'Current password is required' });
//     }

//     if (!newPassword || newPassword.length < 6) {
//       return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
//     }

//     if (newPassword === currentPassword) {
//       return res.status(400).json({ success: false, message: 'New password must be different from current password' });
//     }

//     // Get user with password
//     // const user = await User.findById(req.user._id);
//     const user = await User.findById(req.user._id).select('+password');
//     if (!user.password) {
//         return res.status(500).json({
//             success: false,
//             message: 'Password not found in DB'
//         });
//         }
//     // ✅ VERIFY CURRENT PASSWORD
//     const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ success: false, message: 'Current password is incorrect' });
//     }

//     // ✅ HASH NEW PASSWORD
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);

//     // ✅ SAVE
//     await user.save();

//     res.json({
//       success: true,
//       message: 'Password updated successfully'
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// @desc    Update user password
// @route   PUT /api/user/password
// @access  Private
exports.updateUserPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters.'
      });
    }

    // Must use .select('+password') because password has select: false in schema
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    // ✅ Just assign — let the pre('save') hook hash it ONCE
    // ❌ Do NOT do: user.password = await bcrypt.hash(newPassword, 10)
    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
};
// exports.updatePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     // 🔍 Validate input
//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide current and new password'
//       });
//     }

//     // 🔍 Get user
//     const user = await User.findById(req.user._id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // 🔐 Compare current password
//     const isMatch = await bcrypt.compare(currentPassword, user.password);

//     if (!isMatch) {
//       return res.status(400).json({
//         success: false,
//         message: 'Current password is incorrect'
//       });
//     }

//     // 🔐 Hash new password
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);

//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: 'Password updated successfully'
//     });

//   } catch (error) {
//     console.error('Password update error:', error); // 👈 IMPORTANT
//     res.status(500).json({
//       success: false,
//       message: 'Server error while updating password'
//     });
//   }
// };
// @desc    Delete user account
// @route   DELETE /api/user/profile
// @access  Private (User)
exports.deleteUserAccount = async (req, res, next) => {
  try {
    // ✅ DELETE USER
    await User.findByIdAndDelete(req.user._id);

    // ✅ OPTIONALLY: Delete user's analysis results
    // const AnalysisResult = require('../models/AnalysisResult');
    // await AnalysisResult.deleteMany({ userId: req.user._id });

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};