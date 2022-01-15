const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  active: {
    type: Boolean,
    default: true
  },
  thumbnail: {
    type: String
  },
  category: {
    type: ObjectId,
    ref: "category"
  },
  nominals: [{
    type: ObjectId,
    ref: "nominal"
  }],
  user: {
    type: ObjectId,
    ref: "user"
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

module.exports = mongoose.model('voucher', Schema);