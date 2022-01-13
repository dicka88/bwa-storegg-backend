const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "Name is required"]
  }
});

module.exports = mongoose.model('category', schema);