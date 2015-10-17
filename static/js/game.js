var Game = window.Game = function Game (socket) {
  // Do stuff with the socket.
  console.log('socket', socket)
  this.socket = socket

  this.initEventCallbacks()
}

Game.prototype.initEventCallbacks = function () {
  this.socket.on('disconnect', this.disconnect)

  this.socket.on('tick', function (data) {
    console.log('tick', data)
  })
}

Game.prototype.disconnect = function () {
  // TODO: Clear game loop

  // Clear the body
  window.$('body')
    .find('*').remove().end()
  .addClass('menu')

  // and add the menu again
  window.buildMenu('Someone disconnected (or the server died), so the game has ended. ', []).appendTo('body')
}
