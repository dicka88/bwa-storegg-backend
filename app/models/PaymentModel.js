const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const schema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "Type is required"]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  banks: [{
    type: ObjectId,
    ref: 'bank'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('payment', schema); 