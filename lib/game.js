var ServerPlayer = require('./serverPlayer.js').ServerPlayer

var Game = function () {
  this.players = []
  this.entities = []

  this.maxPlayers = 2

  this.tick = 0
  this.tick_duration = 50
}

Game.prototype.addPlayer = function (socket) {
  this.players.push(new ServerPlayer(socket))
}

Game.prototype.start = function () {
  console.log('Game commencing')

  // physics update
  var _update = this.update.bind(this)
  this.gameLoop = setInterval(_update, this.tick_duration)
}

Game.prototype.update = function () {
  var i
  var cur

  for (i in this.players) {
    cur = this.players[i]
    cur.update(1)
  }

  for (i in this.entities) {
    cur = this.entities[i]
    cur.update(1)
  }
}

module.exports.Game = Game
