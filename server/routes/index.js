const { createGame, joinGame, inputMove, isUserInGame } = require('../actions');

module.exports = {
  commands: ({ text, user_name, user_id, token, command, response_url }) => {
    return new Promise((resolve, reject) => {
      if (token !== process.env.token) {
        return reject('invalid token');
      }
      if (command !== '/rps') {
        return reject('invalid command');
      }
      const arr = (text || '').split(' ');
      if (!arr[0]) {
        // TODO: proper help text
        return resolve('help text');
      }
      switch (arr[0]) {
        case 'create': 
          return isUserInGame(user_id).then(isInGame => {
            if (isInGame) {
              return resolve('you are already in game ' + isInGame._id);
            }
            return createGame(user_id, response_url).then(game => {
              return resolve(`game id ${game._id} created. to join, have your friend type '/rps join ${game._id}'`);
            });
          }).catch(reject);

        case 'join':
          if (!arr[1]) {
            return reject('game id was not provided');
          }
          return isUserInGame(user_id).then(isInGame => {
            if (isInGame) {
              return resolve('you are already in game ' + isInGame._id);
            }
            const game_id = arr[1];
            if (!game_id) {
              return reject('you did not provide a game id');
            }
            return joinGame(user_id, response_url, game_id).then(game => {
              return resolve(`game ${game._id} started: type '/rps [rock, paper, or scissors]' to play`);
            }).catch(reject);
          })
          
        case 'rock':
        case 'paper':
        case 'scissors':
          return isUserInGame(user_id).then(game => {
            if (!game) {
              return reject('you are not currently in a game. `/rps create` to start');
            }
            inputMove(game._id, user_id, arr[0]).then(game => {
              if (game.status === 'waiting-one') {
                return resolve('move accepted. waiting on your opponent.');
              }
              return resolve('game over');
            });
          }).catch(reject);
        default:
          reject('valid commands are `/rps create`, `/rps join [id]`, and `/rps [rock, paper, or scissors]`');
      }
    });
  },
  buttons: () => {

  }
};