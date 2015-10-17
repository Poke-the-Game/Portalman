var BasePlayer = require('../shared/player.js').BasePlayer

var ServerPlayer = function (socket) {
  this.socket = socket

  this.initEventCallbacks()
}

ServerPlayer.prototype = new BasePlayer()

ServerPlayer.prototype.initEventCallbacks = function () {
  var self = this

  this.socket.on('tick', function (data) {
    console.log('tick', data)
  })
}

ServerPlayer.prototype.update = function (dt) {

}

ServerPlayer.prototype.getBase = function () {
  return {
    'x_pos': this.x_pos,
    'y_pos': this.y_pos
  }
}

module.exports.ServerPlayer = ServerPlayer
