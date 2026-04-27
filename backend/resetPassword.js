const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: './.env' });

async function resetPassword() {
  await mongoose.connect(process.env.MONGODB_URI);

  // Reset admin@gmail.com
  const admin = await User.findOne({ email: 'admin401@gmail.com' }).select('+password');
  admin.password = 'admin123';
  await admin.save();
  console.log('✅ Password reset for:', admin.email);

  // Reset your own account too
  const user = await User.findOne({ email: 'ashish4001@gmail.com' }).select('+password');
  user.password = 'ad12345@';
  await user.save();
  console.log('✅ Password reset for:', user.email);

  process.exit();
}

resetPassword();