var BasePlayer = require('../shared/entities.js').BasePlayer
var BaseWall = require('../shared/entities.js').BaseWall
var BaseCube = require('../shared/entities.js').BaseCube

var ServerPlayer = function () {
  BasePlayer.apply(this, arguments)
}
ServerPlayer.prototype = new BasePlayer()
ServerPlayer.prototype.constructor = ServerPlayer
ServerPlayer.prototype.update = function (dt) {
  if (this.inputState.up) {
    this.pos.y -= 0.1 * dt
    this.changedSinceLastTick = true
  }
  if (this.inputState.down) {
    this.pos.y += 0.1 * dt
    this.changedSinceLastTick = true
  }
  if (this.inputState.left) {
    this.pos.x -= 0.1 * dt
    this.changedSinceLastTick = true
  }
  if (this.inputState.right) {
    this.pos.x += 0.1 * dt
    this.changedSinceLastTick = true
  }
}
ServerPlayer.prototype.disconnect = function () {
  console.log('disconnect')
  try {
    this.socket.disconnect()
  } catch (e) {}
}

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
