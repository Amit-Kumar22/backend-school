const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  steps: [{
    stepNumber: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    icon: String
  }],
  requirements: [String],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Admission', admissionSchema);
