const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  mission: {
    type: String,
    required: true
  },
  vision: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  stats: [{
    label: String,
    value: String
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('About', aboutSchema);
