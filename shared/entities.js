if (exports === undefined) {
  var exports = window['entities'] = {}
}

var BaseEntity = function () {
  this.id = 0
  this.pos = {x: 0, y: 0}
  this.rotation = 0
  this.type = ''
  this.changedSinceLastTick = false
  this.velocity = 6
}

var BasePlayer = function () {
  BaseEntity.apply(this, arguments)
  this.type = 'player'
  this.inputState = {}
}
BasePlayer.prototype = new BaseEntity()
BasePlayer.prototype.constructor = BasePlayer

exports.BasePlayer = BasePlayer

var BaseWall = function () {
  BaseEntity.apply(this, arguments)
  this.type = 'wall'
}

BaseWall.prototype = new BaseEntity()
BaseWall.prototype.constructor = BaseWall

exports.BaseWall = BaseWall
