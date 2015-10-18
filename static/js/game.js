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

    window.jQuery('<div id="field">').appendTo('body').css({width: data.size.x * 32, height: data.size.y * 32})
    this.ownPlayerId = data.id

    this.render(data.entities)
    this.mouseInput = new window.MouseInput(document.getElementById(data.id), {x: 'GUN_X', y: 'GUN_Y'})

    window.setInterval(function () {
      this.socket.emit('tick', window.Input.prototype.states)
    }.bind(this), 50)
  }.bind(this))

  this.socket.on('tick', function (data) {
    // console.log('tick', data)
    this.render(data.entities)
    this.handleDeletedEntities(data.deletedEntities)
  }.bind(this))

  this.socket.on('worldUpdate', function (data) {
    console.log('worldUpdate', data)
    this.render(data.entities)
    // TODO: remove all entities which do not exist in new state
  }.bind(this))

  this.socket.on('explosions', function (explosions) {
    explosions.forEach(function (explosion) {
      var $explosion = window.jQuery('<div class="explosion">')
      var top = Math.min(explosion.start.y, explosion.end.y) * 32
      var left = Math.min(explosion.start.x, explosion.end.x) * 32
      var height = Math.abs(explosion.start.y - explosion.end.y) * 32 + 32
      var width = Math.abs(explosion.start.x - explosion.end.x) * 32 + 32
      var css = {top: top, left: left, height: height, width: width}

      $explosion.css(css)
      window.setTimeout(function () { this.remove() }.bind($explosion), 500)
      window.$('#field').append($explosion)
    })
  })

  var self = this

  this.socket.on('death', function (data) {
    self.gameEnded(false)
  })

  this.socket.on('win', function (data) {
    self.gameEnded(true)
  })
}

Game.prototype.handleDeletedEntities = function (deletedEntities) {
  deletedEntities.forEach(function (entity) {
    window.jQuery('#' + entity.id).remove()
  })
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

    if (entity.type === 'portal') {
      $entity.css('border-top', '2px solid ' + entity.color)
    }

    if (entity.targetBlock !== undefined) {
      var $targetBlock = window.jQuery("#"+entity.targetBlock.id)
      $targetBlock.css("background", "green")
      var $targetRay = $entity.find('.target_ray')
      if (!$targetRay.length) {
        $targetRay = window.jQuery('<div class="target_ray">')
        $entity.append($targetRay)
      }
      console.log(entity.targetBlock.length)
      $targetRay.css({width: (entity.targetBlock.length * 32) + 'px'})
    }
  })
}

Game.prototype.gameEnded = function (win) {
  this.socket.disconnect()

  window.$('#field').remove()
  window.$('body').addClass('menu')

  window.showInfo(win ? 'You win! Get yourself some cookies' : 'You loose. Try again another day. Too bad :(')

  window.theMenu.appendTo(window.$('body'))
}

Game.prototype.disconnect = function () {
  // TODO: Clear game loop

  // Clear the body
  window.$('#field').remove()
  window.$('body').addClass('menu')

  window.showInfo('Your opponent disconnected.')

  setTimeout(function () {
    window.hideInfo()
  }, 2000)

  // and add the menu again
  window.theMenu.appendTo(window.$('body'))
}
