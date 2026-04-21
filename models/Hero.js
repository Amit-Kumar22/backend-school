const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    required: true,
    trim: true
  },
  ctaText: {
    type: String,
    default: 'Learn More'
  },
  ctaLink: {
    type: String,
    default: '#about'
  },
  backgroundImage: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hero', heroSchema);
