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
ServerPlayer.prototype.update = function (dt) {
  // cache the old position
  var oldPos = {
    'x': this.pos.x,
    'y': this.pos.y
  }

  if (this.inputState.up) {
    this.pos.y -= this.velocity * dt
    this.changedSinceLastTick = true
  }
  if (this.inputState.down) {
    this.pos.y += this.velocity * dt
    this.changedSinceLastTick = true
  }
  if (this.inputState.left) {
    this.pos.x -= this.velocity * dt
    this.changedSinceLastTick = true
  }
  if (this.inputState.right) {
    this.pos.x += this.velocity * dt
    this.changedSinceLastTick = true
  }

  var positions = [
    [this.pos.x, this.pos.y],
    [this.pos.x + this.size.x, this.pos.y],
    [this.pos.x, this.pos.y + this.size.y],
    [this.pos.x + this.size.x, this.pos.y + this.size.y]
  ]

  var xInt
  var yInt

  for (var i = 0 ; i < 4 /* positions.length */ ; i++) {
    xInt = Math.floor(positions[i][0])
    yInt = Math.floor(positions[i][1])

    if (this.game.collisionMap[xInt][yInt]) {
      this.pos.x = oldPos.x
      this.pos.y = oldPos.y
      this.changedSinceLastTick = false
      break
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

  var bomb = new ServerBomb(x, y)
  bomb.changedSinceLastTick = true
  this.game.addEntity(bomb)
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
