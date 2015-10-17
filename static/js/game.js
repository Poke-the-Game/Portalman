var Game = window.Game = function Game (socket) {
  var self = this

  // Do stuff with the socket.
  console.log('socket', socket)
  this.socket = socket

  this.initEventCallbacks()

  setTimeout(function () {
    self.socket.emit('clientReady')
  }, 1000)
}

Game.prototype.initEventCallbacks = function () {
  this.socket.on('disconnect', this.disconnect)

  this.socket.on('gameStart', function (data) {
    console.log('gameStart', data)
    // data.id is our id -> TODO do something with it
  })

  this.socket.on('tick', function (data) {
    console.log('tick', data)
  })

  this.socket.on('worldUpdate', function (data) {
    console.log('worldUpdate', data)
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
