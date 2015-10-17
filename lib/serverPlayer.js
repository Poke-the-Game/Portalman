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

module.exports.ServerPlayer = ServerPlayer
