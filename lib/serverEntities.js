var BasePlayer = require('../shared/entities.js').BasePlayer
var BaseWall = require('../shared/entities.js').BaseWall

var ServerPlayer = function () {
  BasePlayer.apply(this, arguments)
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
}
ServerPlayer.prototype.disconnect = function () {
  try {
    this.socket.disconnect()
  } catch (e) {}
}

var ServerWall = function (x, y) {
  this.grid.x = x
  this.grid.y = y
}
ServerWall.prototype = new BaseWall()
ServerWall.prototype.constructor = ServerWall

module.exports.ServerPlayer = ServerPlayer
module.exports.ServerWall = ServerWall
