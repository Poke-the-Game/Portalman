var Game = require('./game.js').Game

var GameServer = function GameServer (socket_1, socket_2) {
  this.game = new Game()
  this.game.addPlayer(socket_1)
  this.game.addPlayer(socket_2)
}

module.exports.GameServer = GameServer
