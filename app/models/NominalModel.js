const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  coinQuantity: {
    type: Number,
    default: 0,
    required: true
  },
  coinName: {
    type: String,
    required: [true, "Coin name is required"]
  },
  price: {
    type: Number,
    default: 0,
    required: [true, "Price is required"]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('nominal', Schema);