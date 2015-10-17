if (exports === undefined) {
  var exports = window['entities'] = {}
}

var BaseEntity = {
  id: 0,
  grid: {x: 0, y: 0},
  offset: {x: 0, y: 0},
  rotation: 0,
  type: ''
}

var BasePlayer = function () {
  this.type = 'player'
}
BasePlayer.prototype = BaseEntity

exports.BasePlayer = BasePlayer

var BaseWall = function () {
  this.type = 'wall'
}
BaseWall.prototype = BaseEntity

exports.BaseWall = BaseWall
