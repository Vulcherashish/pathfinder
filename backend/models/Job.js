const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  company: {
    type: String,
    trim: true,
    default: 'Various Companies'
  },
  skills: [
    {
      type: String,
      trim: true
    }
  ],
  salary: {
    type: String,
    required: [true, 'Salary range is required']
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  category: {
    type: String,
    enum: ['tech', 'creative', 'business', 'all'],
    default: 'all'
  },
  careerPath: {
    type: String,
    enum: ['developer', 'designer', 'management', 'analyst', 'all'],
    default: 'all'
  },
  location: {
    type: String,
    default: 'Remote / On-site'
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);
