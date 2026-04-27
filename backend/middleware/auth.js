// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// // Protect routes - verify JWT
// exports.protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   if (!token) {
//     return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id);
//     if (!req.user) {
//       return res.status(401).json({ success: false, message: 'User not found.' });
//     }
//     next();
//   } catch (err) {
//     return res.status(401).json({ success: false, message: 'Token is invalid or expired.' });
//   }
// };

// // Admin only
// exports.adminOnly = (req, res, next) => {
//   if (req.user && req.user.role === 'admin') {
//     return next();
//   }
//   return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
// };
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired.' });
  }
};

// Admin only (KEEPING YOUR OLD LOGIC)
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
};

// ✅ NEW AUTHORIZE MIDDLEWARE (NO CHANGE TO EXISTING LOGIC)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role (${req.user?.role}) not allowed`
      });
    }
    next();
  };
};

// ✅ EXPORT EVERYTHING PROPERLY
module.exports = {
  protect,
  adminOnly,
  authorize
};