const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './.env' });

const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    const existing = await User.findOne({ 
      email: 'admin401@gmail.com' 
    });
    
    if (existing) {
      console.log('Admin already exists!');
      process.exit();
    }

    const password = await bcrypt.hash('admin123', 10);
    
    await User.create({
      name: 'Admin',
      email: 'admin401@gmail.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    process.exit();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedAdmin();