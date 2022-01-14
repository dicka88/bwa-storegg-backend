const mongoose = require('mongoose');

const schema = mongoose.Schema({
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
});

module.exports = mongoose.model('nominal', schema);