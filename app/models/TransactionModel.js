const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  history: {
    voucher: {
      gameName: String,
      category: String,
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
    },
    nominal: {
      coinName: String,
      coinQuantity: Number,
      price: Number
    },
    payment: {
      paymentType: String,
      bankName: String,
      bankAccountNumber: String
    },
    category: {
      name: String,
    },
    user: {
      name: String,
      phoneNumber: String
    }
  },
  verifyId: {
    type: String,
    required: [true, "VerifyId is required"]
  },
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  tax: {
    type: Number,
    default: 0
  },
  value: {
    type: Number,
    default: 0
  },
  category: {
    type: ObjectId,
    ref: "category"
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  player: {
    type: ObjectId,
    ref: 'player'
  },
  user: {
    type: ObjectId,
    ref: 'user'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('transaction', schema);