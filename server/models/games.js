const mongoose = require('mongoose');
const shortid = require('shortid');

const schema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  first: {
    user_id: String,
    response_url: String
  },
  second: {
    user_id: String,
    response_url: String
  },
  checkedIn: [{
    user_id: String,
    move: {
      type: String,
      enum: [ 'rock', 'paper', 'scissors' ]
    }
  }], // this is the list of users who have played this turn
  status: {
    type: String,
    enum: [ 'waiting-one', 'waiting-both', 'game-over' ]
  },
  winner: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('Games', schema);
