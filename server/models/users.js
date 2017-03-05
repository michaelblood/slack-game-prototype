const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user_id: String,
  user_name: String,
  wins: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  },
  current: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('Users', schema);
