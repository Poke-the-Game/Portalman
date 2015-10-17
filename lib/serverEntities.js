var BasePlayer = require('../shared/entities.js').BasePlayer
var BaseWall = require('../shared/entities.js').BaseWall
var BaseCube = require('../shared/entities.js').BaseCube
var BaseBomb = require('../shared/entities.js').BaseBomb

var ServerPlayer = function (x, y) {
  BasePlayer.apply(this, arguments)
  this.pos = {
    'x': x,
    'y': y
  }
  this.size = {
    x: 0.625,
    y: 0.625
  }
}
ServerPlayer.prototype = new BasePlayer()
ServerPlayer.prototype.constructor = ServerPlayer
ServerPlayer.prototype.collides = function (x, y) {
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
      return true
    }
  }
  return false
}
ServerPlayer.prototype.update = function (dt) {
  var fac = 1
  var step = 1 / 20

  if (this.inputState.up) {
    while (this.collides(this.pos.x, this.pos.y - this.velocity * dt * fac) && fac > 0) {
      fac -= step
    }
    if (fac > 0) {
      fac = Math.min(fac, fac + step)
      this.pos.y -= this.velocity * dt * fac
      this.changedSinceLastTick = true
    }
  }

  fac = 1
  if (this.inputState.down) {
    while (this.collides(this.pos.x, this.pos.y + this.velocity * dt * fac) && fac > 0) {
      fac -= step
    }
    if (fac > 0) {
      fac = Math.min(fac, fac + step)
      this.pos.y += this.velocity * dt * fac
      this.changedSinceLastTick = true
    }
  }
  fac = 1
  if (this.inputState.left) {
    while (this.collides(this.pos.x - this.velocity * dt * fac, this.pos.y) && fac > 0) {
      fac -= step
    }
    if (fac > 0) {
      fac = Math.min(fac, fac + step)
      this.pos.x -= this.velocity * dt * fac
      this.changedSinceLastTick = true
    }
  }
  fac = 1
  if (this.inputState.right) {
    while (this.collides(this.pos.x + this.velocity * dt * fac, this.pos.y) && fac > 0) {
      fac -= step
    }
    if (fac > 0) {
      fac = Math.min(fac, fac + step)
      this.pos.x += this.velocity * dt * fac
      this.changedSinceLastTick = true
    }
  }
  // put a bomb
  if (this.inputState.space) {
    this.placeBomb()
    this.changedSinceLastTick = true
  }
}
ServerPlayer.prototype.placeBomb = function () {
  var x = Math.round(this.pos.x)
  var y = Math.round(this.pos.y)

  this.game.addEntity(new ServerBomb(x, y))
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

module.exports.ServerPlayer = ServerPlayer
module.exports.ServerWall = ServerWall
module.exports.ServerCube = ServerCube
module.exports.ServerBomb = ServerBomb
