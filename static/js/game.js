var Game = window.Game = function Game (socket) {
  this.ownPlayerId

  // Do stuff with the socket.
  console.log('socket', socket)
  this.socket = socket

  this.initEventCallbacks()

  setTimeout(function () {
    this.socket.emit('clientReady')
  }.bind(this), 1000)
}

Game.prototype.initEventCallbacks = function () {
  this.socket.on('disconnect', this.disconnect)

  this.socket.on('gameStart', function (data) {
    console.log('gameStart', data)
    window.jQuery('<div id="field">').appendTo('body')
    this.ownPlayerId = data.id
  }.bind(this))

  this.socket.on('tick', function (data) {
    console.log('tick', data)
  })

  this.socket.on('worldUpdate', function (data) {
    console.log('worldUpdate', data)
    data.entities.forEach(function (entity) {
      var $entity = window.jQuery('#' + entity.id)
      if (!$entity.length) {
        $entity = window.jQuery('<div id="' + entity.id + '" class="entity ' + entity.type + '">')
        window.jQuery('#field').append($entity)
      }
      $entity.css('top', entity.grid.y * 32 + entity.offset.y)
      $entity.css('left', entity.grid.x * 32 + entity.offset.x)
    })
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
