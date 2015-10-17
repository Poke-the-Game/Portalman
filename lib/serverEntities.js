var BasePlayer = require('../shared/entities.js').BasePlayer
var BaseWall = require('../shared/entities.js').BaseWall
var BaseCube = require('../shared/entities.js').BaseCube

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
  /*
  // we are coliding with x
  if (this.x < 0 || this.x >= this.game.size.x) {
    this.pos.x = oldPos.x
  }

  // we are coliding with y
  if (this.y < 0 || this.x >= this.game.size.y) {
    this.pos.y = oldPos.y
  }*/

  // compute grid position
  var xInt = Math.round(this.pos.x)
  var yInt = Math.round(this.pos.y)

  // and check if we collide with it
  if (this.game.collisionMap[xInt][yInt]) {
    this.pos.x = oldPos.x
    this.pos.y = oldPos.y
    this.changedSinceLastTick = false
  }
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

module.exports.ServerPlayer = ServerPlayer
module.exports.ServerWall = ServerWall
module.exports.ServerCube = ServerCube
