var BasePlayer = require('../shared/entities.js').BasePlayer
var BaseWall = require('../shared/entities.js').BaseWall
var BaseCube = require('../shared/entities.js').BaseCube
var BaseBomb = require('../shared/entities.js').BaseBomb
var BasePortal = require('../shared/entities.js').BasePortal
var BasePowerup = require('../shared/entities.js').BasePowerup

var ServerPlayer = function (x, y) {
  BasePlayer.apply(this, arguments)
  this.pos = {
    'x': x,
    'y': y
  }
  this.stablePos = {
    'x': x,
    'y': y
  }
  this.portalTo = false
}
ServerPlayer.prototype = new BasePlayer()
ServerPlayer.prototype.constructor = ServerPlayer
ServerPlayer.prototype.isStable = function (x, y) {
  var positions = [
    [x, y],
    [x + this.size.x, y],
    [x + this.size.x, y + this.size.y],
    [x, y + this.size.y]
  ]

  var xInt
  var xSize = this.game.size.x - 1
  var yInt
  var collision
  var ySize = this.game.size.y - 1
  var side

  for (var i = 0 ; i < 4 /* positions.length */ ; i++) {
    xInt = Math.min(Math.max(0, Math.floor(positions[i][0])), xSize)
    yInt = Math.min(Math.max(0, Math.floor(positions[i][1])), ySize)

    collision = this.game.collisionMap[xInt][yInt]

    if (collision && collision.owner && collision.owner.id === this.id) {
      continue
    } else if (collision && collision.canPortal) {
      side = collision.getSide(positions[i][0], positions[i][1])

      if (side === 'right' && typeof collision.portal.right !== 'boolean') {
        this.portalTo = collision.portal.right
      } else if (side === 'left' && typeof collision.portal.left !== 'boolean') {
        this.portalTo = collision.portal.left
      } else if (side === 'top' && typeof collision.portal.top !== 'boolean') {
        this.portalTo = collision.portal.top
      } else if (side === 'bottom' && typeof collision.portal.bottom !== 'boolean') {
        this.portalTo = collision.portal.bottom
      }
      return false
    } else if (collision) {
      return false
    }
  }
  return true
}
ServerPlayer.prototype.stabilize = function () {
  if (!this.isStable(this.pos.x, this.pos.y)) {
    this.pos.x = this.stablePos.x
    this.pos.y = this.stablePos.y
  } else {
    this.stablePos.x = this.pos.x
    this.stablePos.y = this.pos.y
  }
}

ServerPlayer.prototype.updatePosition = function (dt) {
  // set positions
  var fac = 1
  var step = 1 / 20
  var lim = -1

  this.portalTo = false
  this.stabilize()
  if (this.inputState.up) {
    while (!this.isStable(this.pos.x, this.pos.y - this.velocity * dt * fac) && fac > lim) {
      fac -= step
    }
    if (fac > lim) {
      this.pos.y -= this.velocity * dt * fac
      this.changedSinceLastTick = true
    }
  }
  this.stabilize()
  fac = 1
  if (this.inputState.down) {
    while (!this.isStable(this.pos.x, this.pos.y + this.velocity * dt * fac) && fac > lim) {
      fac -= step
    }
    if (fac > lim) {
      this.pos.y += this.velocity * dt * fac
      this.changedSinceLastTick = true
    }
  }
  this.stabilize()
  fac = 1
  if (this.inputState.left) {
    while (!this.isStable(this.pos.x - this.velocity * dt * fac, this.pos.y) && fac > lim) {
      fac -= step
    }
    if (fac > lim) {
      this.pos.x -= this.velocity * dt * fac
      this.changedSinceLastTick = true
    }
  }
  this.stabilize()
  fac = 1
  if (this.inputState.right) {
    while (!this.isStable(this.pos.x + this.velocity * dt * fac, this.pos.y) && fac > lim) {
      fac -= step
    }
    if (fac > lim) {
      this.pos.x += this.velocity * dt * fac
      this.changedSinceLastTick = true
    }
  }
  this.stabilize()
}

ServerPlayer.prototype.updateRotation = function () {
  var gunX = this.inputState.GUN_X
  var gunY = this.inputState.GUN_Y

  var newRotation = ((Math.atan2(-gunX, gunY) / (2 * Math.PI)) * 360) + 180

  if (!isNaN(newRotation) && this.rotation !== newRotation) {
    this.rotation = newRotation
    this.changedSinceLastTick = true
  }
}

ServerPlayer.prototype.updateBomb = function () {
  if (this.inputState.space) {
    this.placeBomb()
    this.changedSinceLastTick = true
  }
}

ServerPlayer.prototype.doPortaling = function () {
  if (this.portalTo) {
    var target = this.portalTo[0]
    var side = this.portalTo[1]
    var targetX = target.pos.x
    var targetY = target.pos.y

    if (side === 'right') {
      targetX += 1
    } else if (side === 'left') {
      targetX -= 1
    } else if (side === 'top') {
      targetY -= 1
    } else if (side === 'bottom') {
      targetY += 1
    }
    this.portalTo = false
    this.pos.x = targetX
    this.pos.y = targetY
    this.changedSinceLastTick = true
  }
}

ServerPlayer.prototype.update = function (dt) {
  // rewite the rotation
  this.updateRotation()

  // update the positions
  this.updatePosition(dt)

  // put a bomb
  this.updateBomb()

  // do some portaling
  this.doPortaling()
}
ServerPlayer.prototype.placeBomb = function () {
  var x = Math.round(this.pos.x)
  var y = Math.round(this.pos.y)

  if (this.game.collisionMap[x][y]) {
    return
  }

  if (!this.game.collisionMap[x][y]) {
    // create the bomb
    var bomb = new ServerBomb(x, y)
    bomb.owner = this
    bomb.changedSinceLastTick = true

    // add it to the game
    this.game.addEntity(bomb)
    this.game.collisionMap[x][y] = bomb

    bomb.ignite()
  }
}
ServerPlayer.prototype.die = function () {
  this.game.killMe(this)
}
ServerPlayer.prototype.disconnect = function () {
  try {
    this.socket.disconnect()
  } catch (e) {}
}
ServerPlayer.prototype.projectRay = function () {}

var ServerWall = function (x, y, canPortal) {
  BaseWall.apply(this, arguments)
  this.pos = {
    'x': x,
    'y': y
  }
  this.canPortal = canPortal
}
ServerWall.prototype = new BaseWall()
ServerWall.prototype.constructor = ServerWall

var ServerCube = function (x, y) {
  BaseCube.apply(this, arguments)
  this.pos = {
    'x': x,
    'y': y
  }
  this.portals = {
    'top': false,
    'right': false,
    'bottom': false,
    'left': false
  }
}
ServerWall.prototype.getSide = function (x, y) {
  var theX = x % 1
  var theY = y % 1

  var dTop = typeof this.portal.top !== 'boolean' ? theX : Infinity
  var dRight = typeof this.portal.right !== 'boolean' ? 1 - theY : Infinity
  var dBottom = typeof this.portal.bottom !== 'boolean' ? 1 - theX : Infinity
  var dLeft = typeof this.portal.left !== 'boolean' ? theX : Infinity

  var theMin = Math.min(dTop, dRight, dBottom, dLeft)
  
  if (theMin === dTop && typeof this.portal.top !== 'boolean') {
    return 'top'
  } else if (theMin === dRight && typeof this.portal.right !== 'boolean') {
    return 'right'
  } else if (theMin === dBottom && typeof this.portal.bottom !== 'boolean') {
    return 'bottom'
  } else if (theMin === dLeft && typeof this.portal.left !== 'boolean') {
    return 'left'
  }

  return false
}
ServerCube.prototype = new BaseCube()
ServerCube.prototype.constructor = ServerCube

var ServerBomb = function (x, y) {
  BaseBomb.apply(this, arguments)
  this.pos = {
    'x': x,
    'y': y
  }
  this.exploding = false
}
ServerBomb.prototype = new BaseBomb()
ServerBomb.prototype.constructor = ServerBomb
ServerBomb.prototype.ignite = function () {
  this.bombLoop = setTimeout(function () {
    this.explode()
  }.bind(this), this.diffusionTime)
}
ServerBomb.prototype.explode = function () {
  this.exploding = true
  clearTimeout(this.bombLoop)
  this.game.deleteEntity(this)
  this.computeDamage(this.pos, this.game)
  this.game.collisionMap[this.pos.x][this.pos.y] = false
}
ServerBomb.prototype.computeDamage = function (origin) {
  // check if player remained on bomb
  for (var i in this.game.players) {
    var entity = this.game.players[i].entity
    var pos = entity.pos
    var gridX = Math.round(pos.x)
    var gridY = Math.round(pos.y)

    if (gridX === origin.x && gridY === origin.y) {
      entity.die()
    }
  }

  // compute fire blaze
  var exploders = []
  exploders.push(this.spreadExplosion(origin, {x: 1, y: 0}))
  exploders.push(this.spreadExplosion(origin, {x: 0, y: 1}))
  exploders.push(this.spreadExplosion(origin, {x: -1, y: 0}))
  exploders.push(this.spreadExplosion(origin, {x: 0, y: -1}))

  this.game.server.io.sockets.emit('explosions', exploders)
}
ServerBomb.prototype.collidesWith = function (player) {
  var positions = [
    [player.pos.x, player.pos.y],
    [player.pos.x + player.size.x, player.pos.y],
    [player.pos.x + player.size.x, player.pos.y + this.size.y],
    [player.pos.x, player.pos.y + player.size.y]
  ]

  var xInt
  var xSize = this.game.size.x - 1
  var yInt
  var ySize = this.game.size.y - 1

  for (var i = 0 ; i < 4 /* positions.length */ ; i++) {
    xInt = Math.min(Math.max(0, Math.floor(positions[i][0])), xSize)
    yInt = Math.min(Math.max(0, Math.floor(positions[i][1])), ySize)

    if (xInt === this.pos.x && yInt === this.pos.y) {
      return true
    }
  }
  return false
}
ServerBomb.prototype.update = function () {
  if (this.owner && !this.collidesWith(this.owner)) {
    this.owner = false
  }
}
ServerBomb.prototype.spreadExplosion = function (origin, direction) {
  var colMap = this.game.collisionMap
  var counter = this.explosionRange

  var x = origin.x + direction.x
  var y = origin.y + direction.y
  while (true) {
    var cur = colMap[x][y]

    // check map tiles
    if (cur) {
      if (cur.isDestroyable) {
        this.game.deleteEntity(cur)
        this.game.collisionMap[x][y] = false
      } else if (cur.type === 'bomb') {
        if (!cur.exploding) {
          cur.explode()
        }
      } else {
        x -= direction.x
        y -= direction.y
      }
      break
    }

    // check player death
    for (var i in this.game.players) {
      var entity = this.game.players[i].entity
      var pos = entity.pos
      var gridX = Math.round(pos.x)
      var gridY = Math.round(pos.y)

      if (gridX === x && gridY === y) {
        entity.die()
      }
    }

    // check range condition
    counter -= 1
    if (counter <= 0) {
      break
    }

    // travel further on
    x += direction.x
    y += direction.y
  }

  return {start: origin, end: {x: x, y: y}}
}

var ServerPortal = function (x, y, rotation) {
  BasePortal.apply(this, arguments)
  this.pos = {
    'x': x,
    'y': y
  }
  this.rotation = rotation
}
ServerPortal.prototype = new BasePortal()
ServerPortal.prototype.constructor = ServerPortal

var ServerPowerup = function (x, y) {
  BasePowerup.apply(this, arguments)
  this.pos = {
    'x': x,
    'y': y
  }
  this.portals = {
    'top': false,
    'right': false,
    'bottom': false,
    'left': false
  }
}
ServerPowerup.prototype = new BasePowerup()
ServerPowerup.prototype.constructor = ServerPowerup

module.exports.ServerPlayer = ServerPlayer
module.exports.ServerWall = ServerWall
module.exports.ServerCube = ServerCube
module.exports.ServerBomb = ServerBomb
module.exports.ServerPortal = ServerPortal
module.exports.ServerPowerup = ServerPowerup
