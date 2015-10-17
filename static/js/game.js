var Game = window.Game = function Game (socket) {
  // Do stuff with the socket.
  console.log('socket', socket)
  this.socket = socket

  this.initEventCallbacks()
}

Game.prototype.initEventCallbacks = function () {
  var self = this

  this.socket.on('disconnect', this.disconnect)

  this.socket.on('tick', function (data) {
    console.log('tick', data)
  })
}

Game.prototype.disconnect = function () {
  console.log('disconnect')
}
