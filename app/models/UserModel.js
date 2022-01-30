const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"]
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "admin"
  },
  avatarPhoto: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('user', Schema);