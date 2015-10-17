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
}
ServerPlayer.prototype = new BasePlayer()
ServerPlayer.prototype.constructor = ServerPlayer
ServerPlayer.prototype.update = function (dt) {
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

  if (this.inputState.space) {
    this.placeBomb()
    this.changedSinceLastTick = true
  }
}
ServerPlayer.prototype.placeBomb = function () {
  console.log('bomb')

  var x = Math.floor(this.pos.x)
  var y = Math.floor(this.pos.y)

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
