const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true,
    default: '',
    validate: {
      validator: function(v) {
        // If imageUrl is provided, validate it as a URL
        if (v && v.length > 0) {
          return /^https?:\/\/.+\..+/.test(v) || /^\/uploads\/.+/.test(v);
        }
        return true;
      },
      message: 'Please provide a valid image URL (http/https) or upload path'
    }
  },
  features: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['academic', 'sports', 'infrastructure', 'technology', 'recreation', 'other'],
    default: 'other'
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOnHomepage: {
    type: Boolean,
    default: true
  },
  capacity: {
    type: String,
    trim: true,
    default: ''
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  availability: {
    type: String,
    enum: ['available', 'maintenance', 'unavailable'],
    default: 'available'
  },
  contactInfo: {
    type: String,
    trim: true,
    default: ''
  },
  createdBy: {
    type: String,
    default: 'Admin'
  },
  viewCount: {
    type: Number,
    default: 0
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

// Index for efficient queries
facilitySchema.index({ isActive: 1, displayOnHomepage: 1, priority: -1 });
facilitySchema.index({ category: 1, isActive: 1 });

// Update the updatedAt field before saving
facilitySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to increment view count
facilitySchema.methods.incrementViews = function() {
  this.viewCount += 1;
  return this.save();
};

// Static method to get active facilities for homepage
facilitySchema.statics.getActiveForHomepage = function(limit = 6) {
  return this.find({
    isActive: true,
    displayOnHomepage: true
  }).sort({ priority: -1, createdAt: -1 }).limit(limit);
};

// Static method to get facilities by category
facilitySchema.statics.getByCategory = function(category) {
  return this.find({
    isActive: true,
    category: category
  }).sort({ priority: -1, createdAt: -1 });
};

module.exports = mongoose.model('Facility', facilitySchema);