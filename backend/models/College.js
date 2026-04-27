const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'College name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  course: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3.5
  },
  description: {
    type: String,
    default: ''
  },
  fees: {
    type: String,
    default: 'Contact for details'
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
  website: {
    type: String,
    default: '#'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('College', collegeSchema);
