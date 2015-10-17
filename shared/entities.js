if (exports === undefined) {
  var exports = window['entities'] = {}
}

var BaseEntity = function () {}
BaseEntity.prototype.id = 0
BaseEntity.prototype.grid = {x: 0, y: 0}

var BasePlayer = function () {}
BasePlayer.prototype = BaseEntity
BasePlayer.prototype.constructor = BasePlayer
BasePlayer.prototype.offset = {x: 0, y: 0} // position relative to center of current grid position

exports.BasePlayer = BasePlayer

var BaseWall = function () {}
BaseWall.prototype = BaseEntity
BaseWall.prototype.constructor = BaseWall
BaseWall.prototype.isMoonStone = false // portal can be placed here

exports.BaseWall = BaseWall
