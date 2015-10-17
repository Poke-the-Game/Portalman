var BasePlayer = require('../shared/player.js').BasePlayer

var ServerPlayer = function () {

}

ServerPlayer.prototype = new BasePlayer()

ServerPlayer.prototype.update = function (dt) {

}

module.exports.ServerPlayer = ServerPlayer
