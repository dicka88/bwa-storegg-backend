const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    select: false,
    required: [true, "Password is required"]
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    minLength: [9, "Min length is 9"],
    maxLength: [13, "Max length is 13"]
  },
  avatar: {
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
  email: {
    type: String,
    required: [true, "Password is required"],
    unique: true
  },
  favoriteGameCategory: {
    type: ObjectId,
    ref: 'category'
  }
}, {
  timestamps: true
});

Schema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password);
  next();
});

Schema.path('email').validate(async function (value) {

});

module.exports = mongoose.model('player', Schema);