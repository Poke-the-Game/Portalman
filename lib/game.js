var ServerPlayer = require('./serverPlayer.js').ServerPlayer

var Game = function () {
  this.players = []

  this.tick = 0
  this.tick_duration = 50
}

Game.prototype.addPlayer = function (socket) {
  console.log(socket)
  this.players.push(new ServerPlayer(socket))
}

Game.prototype.start = function () {
  var _update = this.update.bind(this)
  this.gameLoop = setInterval(_update, this.tick_duration)
}

Game.prototype.update = function () {
  for (var i in this.players) {
    var cur = this.players[i]
    cur.update(1)
  }
}

module.exports.Game = Game
