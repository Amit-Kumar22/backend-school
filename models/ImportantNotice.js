const mongoose = require('mongoose');

const importantNoticeSchema = new mongoose.Schema({
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
  link: {
    type: String,
    trim: true,
    default: '',
    validate: {
      validator: function(v) {
        // If link is provided, validate it as a URL
        if (v && v.length > 0) {
          return /^https?:\/\/.+\..+/.test(v) || /^\/[\w\-\._~:\/\?#[\]@!\$&'\(\)\*\+,;%=]*$/.test(v);
        }
        return true;
      },
      message: 'Please provide a valid URL (http/https) or relative path'
    }
  },
  linkText: {
    type: String,
    trim: true,
    default: 'Read More'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'alert', 'success'],
    default: 'info'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null // null means no expiry
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOnHomepage: {
    type: Boolean,
    default: true
  },
  showAsTicker: {
    type: Boolean,
    default: false
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
importantNoticeSchema.index({ isActive: 1, displayOnHomepage: 1, startDate: 1, endDate: 1 });
importantNoticeSchema.index({ priority: 1, createdAt: -1 });

// Update the updatedAt field before saving
importantNoticeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to check if notice is currently valid
importantNoticeSchema.methods.isCurrentlyValid = function() {
  const now = new Date();
  const startDate = this.startDate || new Date(0);
  const endDate = this.endDate || new Date('9999-12-31');
  
  return this.isActive && 
         now >= startDate && 
         now <= endDate;
};

// Static method to get active notices for homepage
importantNoticeSchema.statics.getActiveForHomepage = function() {
  const now = new Date();
  return this.find({
    isActive: true,
    displayOnHomepage: true,
    startDate: { $lte: now },
    $or: [
      { endDate: null },
      { endDate: { $gte: now } }
    ]
  }).sort({ priority: -1, createdAt: -1 });
};

module.exports = mongoose.model('ImportantNotice', importantNoticeSchema);