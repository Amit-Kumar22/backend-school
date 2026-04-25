const mongoose = require('mongoose');

const schoolTimingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'School Timing'
  },
  description: {
    type: String,
    trim: true,
    default: 'Our daily schedule and timing information'
  },
  timingEntries: [{
    period: {
      type: String,
      required: true,
      trim: true
    },
    startTime: {
      type: String,
      required: true,
      trim: true
    },
    endTime: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['class', 'break', 'lunch', 'assembly', 'sports', 'other'],
      default: 'class'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  weekDays: {
    type: [String],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  schoolStartTime: {
    type: String,
    required: true,
    default: '08:00'
  },
  schoolEndTime: {
    type: String,
    required: true,
    default: '15:00'
  },
  breakTime: {
    type: String,
    default: '10:30 - 10:45'
  },
  lunchTime: {
    type: String,
    default: '12:30 - 13:15'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOnHomepage: {
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
schoolTimingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SchoolTiming', schoolTimingSchema);