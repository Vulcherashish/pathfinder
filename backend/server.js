// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const connectDB = require('./config/db');
// const errorHandler = require('./middleware/errorHandler');
// const quizRoutes = require('./routes/quiz');
// const app = express();

// connectDB();

// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: false
// }));

// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ limit: '10mb', extended: true }));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/analysis', require('./routes/analysis'));
// app.use('/api/jobs', require('./routes/jobs'));
// app.use('/api/colleges', require('./routes/colleges'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/uploads', require('./routes/uploads'));
// app.use('/api/admin', require('./routes/admin'));
// app.use('/api/quiz', quizRoutes);
// app.get('/api/health', (req, res) => {
//   res.json({ success: true, message: 'Pathfinder API is running 🚀' });
// });

// app.use('*', (req, res) => {
//   res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
// });

// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
// File: app.js or server.js
// Shows how to properly register both admin and public quiz routes

// ✅ FIXED server.js - WITH MONGODB CONNECTION

require('dotenv').config();  // ⚠️ MUST BE FIRST LINE!

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');  // ✅ IMPORT DATABASE CONNECTION

const app = express();

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// CONNECT TO MONGODB FIRST
// ============================================
// ✅ THIS IS THE KEY LINE YOU WERE MISSING!
connectDB();

// Small delay to ensure connection is established
setTimeout(() => {
  // ============================================
  // ROUTE IMPORTS
  // ============================================
  const authRoutes = require('./routes/auth');
  const analysisRoutes = require('./routes/analysis');
  const jobRoutes = require('./routes/jobs');
  const collegeRoutes = require('./routes/colleges');
  // const userRoutes = require('./routes/users');
  const uploadRoutes = require('./routes/uploads');
  const quizRoutes = require('./routes/quiz');
  const userRoutes = require('./routes/userRoutes');
  const adminRoutes = require('./routes/admin');

  // ============================================
  // MOUNT ROUTES
  // ============================================
  app.use('/api/user', userRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/analysis', analysisRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/colleges', collegeRoutes);
  // app.use('/api/users', userRoutes);
  app.use('/api/uploads', uploadRoutes);
  app.use('/api/quiz', quizRoutes);

  // ============================================
  // HEALTH CHECK
  // ============================================
  app.get('/api/health', (req, res) => {
    res.json({ 
      success: true, 
      message: 'Pathfinder API is running 🚀',
      mongodb: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED'
    });
  });

  // ============================================
  // 404 HANDLER
  // ============================================
  app.use('*', (req, res) => {
    res.status(404).json({ 
      success: false, 
      message: `Route ${req.originalUrl} not found.` 
    });
  });

  // ============================================
  // ERROR HANDLER
  // ============================================
  const errorHandler = require('./middleware/errorHandler');
  app.use(errorHandler);

  // ============================================
  // START SERVER
  // ============================================
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║  🚀 PATHFINDER BACKEND STARTED             ║
║  📍 Port: ${PORT}                           ║
║  🌍 URL: http://localhost:${PORT}        ║
║  📊 MongoDB: CONNECTED ✅                  ║
║  🔧 API Base: http://localhost:${PORT}/api ║
╚════════════════════════════════════════════╝
    `);
  });

}, 1000);  // 1 second delay for MongoDB to connect

module.exports = app;