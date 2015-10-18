var BasePlayer = require('../shared/entities.js').BasePlayer
var BaseWall = require('../shared/entities.js').BaseWall
var BaseCube = require('../shared/entities.js').BaseCube
var BaseBomb = require('../shared/entities.js').BaseBomb
var BasePortal = require('../shared/entities.js').BasePortal

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
}
ServerPlayer.prototype = new BasePlayer()
ServerPlayer.prototype.constructor = ServerPlayer
ServerPlayer.prototype.isStable = function (x, y) {
  var positions = [
    [x, this.pos.y],
    [x + this.size.x, y],
    [x + this.size.x, y + this.size.y],
    [x, y + this.size.y]
  ]

  var xInt
  var xSize = this.game.size.x - 1
  var yInt
  var ySize = this.game.size.y - 1

  for (var i = 0 ; i < 4 /* positions.length */ ; i++) {
    xInt = Math.min(Math.max(0, Math.floor(positions[i][0])), xSize)
    yInt = Math.min(Math.max(0, Math.floor(positions[i][1])), ySize)

    if (this.game.collisionMap[xInt][yInt]) {
      return false
    }
  }
  return true
}
ServerPlayer.prototype.stablize = function () {
  if (!this.isStable(this.pos.x, this.pos.y)) {
    this.pos.x = this.stablePos.x
    this.pos.y = this.stablePos.y
  } else {
    this.stablePos.x = this.pos.x
    this.stablePos.y = this.pos.y
  }
}
ServerPlayer.prototype.update = function (dt) {
  var fac = 1
  var step = 1 / 20
  var lim = -1

  this.stablize()
  if (this.inputState.up) {
    while (!this.isStable(this.pos.x, this.pos.y - this.velocity * dt * fac) && fac > lim) {
      fac -= step
    }
    if (fac > lim) {
      this.pos.y -= this.velocity * dt * fac
      this.changedSinceLastTick = true
    }
  }
  this.stablize()
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
  this.stablize()
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
  this.stablize()
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
  this.stablize()
  // put a bomb
  if (this.inputState.space) {
    this.placeBomb()
    this.changedSinceLastTick = true
  }
}
ServerPlayer.prototype.placeBomb = function () {
  var x = Math.round(this.pos.x)
  var y = Math.round(this.pos.y)

  var bomb = new ServerBomb(x, y)
  bomb.changedSinceLastTick = true
  this.game.addEntity(bomb)

  setTimeout(function () { bomb.explode(this.game) }.bind(this), bomb.diffusionTime)
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
}
ServerCube.prototype = new BaseCube()
ServerCube.prototype.constructor = ServerCube

var ServerBomb = function (x, y) {
  BaseBomb.apply(this, arguments)
  this.pos = {
    'x': x,
    'y': y
  }
}
ServerBomb.prototype = new BaseBomb()
ServerBomb.prototype.constructor = ServerBomb
ServerBomb.prototype.explode = function (game) {
  this.computeDamage(this.pos, game)
  this.game.deleteEntity(this)
}
ServerBomb.prototype.computeDamage = function (origin, game) {
  var exploders = []

  exploders.push(this.spreadExplosion(origin, {x: 1, y: 0}))
  exploders.push(this.spreadExplosion(origin, {x: 0, y: 1}))
  exploders.push(this.spreadExplosion(origin, {x: -1, y: 0}))
  exploders.push(this.spreadExplosion(origin, {x: 0, y: -1}))

  game.server.io.sockets.emit('explosions', exploders)
}
ServerBomb.prototype.spreadExplosion = function (origin, direction) {
  var colMap = this.game.collisionMap
  var counter = this.explosionRange

  var x = origin.x + direction.x
  var y = origin.y + direction.y
  while (true) {
    var cur = colMap[x][y]
    if (cur) {
      if (cur.isDestroyable) {
        this.game.deleteEntity(cur)
        this.game.collisionMap[x][y] = false
      } else {
        x -= direction.x
        y -= direction.y
      }
      break
    }

    counter -= 1
    if (counter <= 0) {
      break
    }

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

module.exports.ServerPlayer = ServerPlayer
module.exports.ServerWall = ServerWall
module.exports.ServerCube = ServerCube
module.exports.ServerBomb = ServerBomb
module.exports.ServerPortal = ServerPortal
