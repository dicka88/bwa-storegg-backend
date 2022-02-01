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
    asset_id: String,
    public_id: String,
    bytes: Number,
    width: Number,
    height: Number,
    format: String,
    created_at: String,
    url: String,
    secure_url: String,
    original_filename: String,
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('voucher', Schema);