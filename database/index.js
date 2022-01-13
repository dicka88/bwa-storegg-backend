const mongoose = require('mongoose');
const { mongoDbUrl } = require('../config');

mongoose.connect(mongoDbUrl);

const db = mongoose.connection;

module.exports = db;