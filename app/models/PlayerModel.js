const mongoose = require('mongoose');

// const { ObjectId } = mongoose.Types;

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    minLength: [9, "Min length is 9"],
    maxLength: [13, "Max length is 13"]
  },
  avatar: String,
  email: {
    type: String,
    required: [true, "Password is required"]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('player', Schema);