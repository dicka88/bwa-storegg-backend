const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

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
    type: String
  },
  avatarPhoto: {
    type: String
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

module.exports = mongoose.model('users', Schema);