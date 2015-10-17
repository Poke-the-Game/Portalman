var BasePlayer = require('../shared/entities.js').BasePlayer
var BaseWall = require('../shared/entities.js').BaseWall

var ServerPlayer = function () {
  BasePlayer.call(this)
}
ServerPlayer.prototype = new BasePlayer()
ServerPlayer.prototype.constructor = ServerPlayer
ServerPlayer.prototype.update = function (dt) {

}
ServerPlayer.prototype.disconnect = function () {
  console.log('disconnect')
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
