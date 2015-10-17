var Game = require('./game.js').Game

var GameServer = function GameServer (io, sockets) {
  var self = this
  this.io = io

  this.game = new Game()
  sockets.forEach(function (ele) {
    self.game.addPlayer(ele)
  })

  this.game.start()
}

module.exports.GameServer = GameServer
