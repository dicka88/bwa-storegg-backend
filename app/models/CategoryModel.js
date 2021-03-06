const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('category', Schema);