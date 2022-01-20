const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  bankName: {
    type: String,
    required: [true, "Bank name is required"]
  },
  bankAccountNumber: {
    type: String,
    required: [true, "Bank account number is required"]
  }
});

module.exports = mongoose.model('bank', Schema);