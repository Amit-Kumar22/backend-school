const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  imageUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // If imageUrl is provided, validate it as a URL
        if (v && v.length > 0) {
          return /^https?:\/\/.+\..+/.test(v);
        }
        return true;
      },
      message: 'Please provide a valid image URL (http/https)'
    }
  },
  date: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
noticeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Notice', noticeSchema);