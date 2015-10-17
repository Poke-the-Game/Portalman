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
  this.game = undefined
}

BaseEntity.prototype.update = function () {}
BaseEntity.prototype.serialize = function () {
  return {
    'id': this.id,
    'type': this.type,
    'pos': this.pos,
    'rotation': this.rotation,
    'canPortal': this.canPortal
  }
}

var BasePlayer = function () {
  BaseEntity.apply(this, arguments)
  this.type = 'player'
  this.inputState = {}

  this.maxBombNum = 1
}
BasePlayer.prototype = new BaseEntity()
BasePlayer.prototype.constructor = BasePlayer

exports.BasePlayer = BasePlayer

var BaseWall = function () {
  BaseEntity.apply(this, arguments)
  this.type = 'wall'
  this.canPortal = false
}

BaseWall.prototype = new BaseEntity()
BaseWall.prototype.constructor = BaseWall

exports.BaseWall = BaseWall

var BaseCube = function () {
  BaseEntity.apply(this, arguments)
  this.type = 'cube'
  this.canPortal = false
}

BaseCube.prototype = new BaseEntity()
BaseCube.prototype.constructor = BaseCube

exports.BaseCube = BaseCube

var BaseBomb = function () {
  BaseEntity.apply(this, arguments)
  this.type = 'bomb'
  this.canPortal = false
}

BaseBomb.prototype = new BaseEntity()
BaseBomb.prototype.constructor = BaseBomb

exports.BaseBomb = BaseBomb
