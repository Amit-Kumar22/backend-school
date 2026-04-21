const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  alternatePhone: String,
  fax: String,
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    youtube: String
  },
  mapLocation: {
    latitude: Number,
    longitude: Number
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contact', contactSchema);
