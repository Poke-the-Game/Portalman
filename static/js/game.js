var Game = window.Game = function Game (socket) {
  // Do stuff with the socket.
  console.log('socket', socket)
  this.socket = socket

  socket.on('disconnect', this.disconnect)
}

Game.prototype.disconnect = function () {
  console.log('disconnect')
}
