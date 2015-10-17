var Game = window.Game = function Game (socket, next) {
  this.ownPlayerId

  // Do stuff with the socket.
  console.log('socket', socket)
  this.socket = socket

  this.initEventCallbacks()

  setTimeout(function () {
    next()
    this.socket.emit('clientReady')
  }.bind(this), 1000)
}

Game.prototype.initEventCallbacks = function () {
  this.socket.on('disconnect', this.disconnect)

  this.socket.on('gameStart', function (data) {
    console.log('Client id', data.id)

    window.jQuery('<div id="field">').appendTo('body')
    this.ownPlayerId = data.id
    window.setInterval(function () {
      this.socket.emit('tick', window.Input.prototype.states)
    }.bind(this), 50)
  }.bind(this))

  this.socket.on('tick', function (data) {
    console.log('tick', data)
    this.render(data.entities)
  }.bind(this))

  this.socket.on('worldUpdate', function (data) {
    console.log('worldUpdate', data)
    this.render(data.entities)
  }.bind(this))
}

Game.prototype.render = function (entities) {
  entities.forEach(function (entity) {
    var $entity = window.jQuery('#' + entity.id)
    if (!$entity.length) {
      $entity = window.jQuery('<div id="' + entity.id + '" class="entity ' + entity.type + '">')
      window.jQuery('#field').append($entity)
    }

    $entity.css('top', entity.pos.y * 32)
    $entity.css('left', entity.pos.x * 32)
    $entity.css('transform', 'rotate(' + entity.rotation + 'deg)')

    $entity.css('width', entity.size.x * 32)
    $entity.css('height', entity.size.y * 32)

    if (entity.canPortal) {
      $entity.addClass('can_portal')
    } else {
      $entity.removeClass('can_portal')
    }
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
