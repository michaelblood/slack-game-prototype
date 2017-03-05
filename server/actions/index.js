const request = require('request');

const { Games } = require('../models');

const getRequestData = (url, message) => {
  return {
    url,
    json: {
      text: message,
    },
    method: 'POST'
  }
};

const alertUsers = (game, winner) => {
  let { first, second } = game;
  if (winner.user_id === first.user_id) {
    request(getRequestData(first.response_url, 'you won'));
    request(getRequestData(second.response_url, 'you lost'));
    return;
  }
  request(getRequestData(second.response_url, 'you won'));
  request(getRequestData(first.response_url, 'you lost'));
};

const computeWinner = (p1, p2) => {
  let moves = [p1.move, p2.move].sort();
  if (moves[0] === 'rock') {
    return (p1.move === 'rock') ? p1 : p2;
  }
  if (moves[1] === 'rock') {
    return (p1.move === 'paper') ? p1 : p2;
  }
  return (p1.move === 'scissors') ? p1 : p2;
};

const getResult = (game) => {
  const checkedIn = game.checkedIn;
  if (checkedIn.length < 2) {
    return game;
  }
  const [p1, p2] = checkedIn;
  if (p1.move === p2.move) {
    game.status = 'game-over';
    return game.save();
  }
  const winner = computeWinner(p1, p2);
  alertUsers(game, winner);
  game.status = 'game-over';
  return game.save();
};

exports.createGame = (user_id, response_url) => {
  return Games.create({
    first: { user_id, response_url },
    second: { user_id: '', response_url: '' },
    checkedIn: [],
    status: 'waiting-both',
  });
};

exports.createUser = (user_id, user_name) => {
  if (!user_id || !user_name) {
    return Promise.reject('missing parameter');
  }
  return Users.create({user_id, user_name});
};

exports.joinGame = (user_id, response_url, game_id) => {
  return Games.findById(game_id).then(game => {
    if (!game) {
      throw new Error('invalid game id');
    }
    if (game.second.user_id !== '') {
      throw new Error('game is full');
    }
    game.second.user_id = user_id;
    game.second.response_url = response_url;
    request(getRequestData(game.first.response_url, `game ${game._id} started: type '/rps [rock, paper, or scissors]' to play`));
    return game.save();
  })
};

exports.inputMove = (game_id, user_id, move) => {
  return Games.findById(game_id).then(game => {
    if (['paper', 'rock', 'scissors'].indexOf(move) === -1) {
      throw new Error('invalid move');
    }
    if (user_id !== game.first.user_id && user_id !== game.second.user_id) {
      throw new Error('user does not belong to this game');
    }
    if (game.status === 'game-over') {
      throw new Error('this game is over');
    }

    game.checkedIn.push({user_id, move});
    if (game.checkedIn.length === 1) {
      game.status = 'waiting-one';
      return game.save();
    }
    return getResult(game);
  })
};

exports.isUserInGame = (user_id) => {
  return Games.find({
    $and: [
      { $or: [{ 'first.user_id': user_id }, { 'second.user_id': user_id }] },
      { status: { $not: /game-over/ig } }
    ]
  }).then(docs => {
    if (!docs[0]) {
      return null;
    }
    return docs[0];
  });
};
