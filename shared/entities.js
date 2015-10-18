if (exports === undefined) {
  var exports = window['entities'] = {}
}

var BaseEntity = function () {
  this.id = 0
  this.pos = {x: 0, y: 0}
  this.size = {x: 1, y: 1}
  this.rotation = 0
  this.type = ''
  this.changedSinceLastTick = false
  this.velocity = 6
  this.owner = false
  this.game = undefined
  this.portal = {
    'top': false,
    'right': false,
    'bottom': false,
    'left': false
  }
  this.color = undefined
}

BaseEntity.prototype.update = function () {}
BaseEntity.prototype.serialize = function () {
  return {
    'id': this.id,
    'type': this.type,
    'pos': this.pos,
    'size': this.size,
    'rotation': this.rotation,
    'canPortal': this.canPortal,
    'color': this.color,
    'targetBlock': this.targetBlock,
    'stats': {
      'maxBombNum': this.maxBombNum,
      'explosionRange': this.explosionRange
    }
  }
}

var BasePlayer = function () {
  BaseEntity.apply(this, arguments)
  this.type = 'player'
  this.inputState = {}
  this.size = {
    x: 0.8,
    y: 0.8
  }
  this.currentBombNum = 0

  // modify by powerups
  this.maxBombNum = 1
  this.explosionRange = 2
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
  this.isDestroyable = true
}

BaseCube.prototype = new BaseEntity()
BaseCube.prototype.constructor = BaseCube

exports.BaseCube = BaseCube

var BaseBomb = function () {
  BaseEntity.apply(this, arguments)
  this.type = 'bomb'
  this.canPortal = false
  this.diffusionTime = 4000
}

BaseBomb.prototype = new BaseEntity()
BaseBomb.prototype.constructor = BaseBomb

exports.BaseBomb = BaseBomb

var BasePortal = function () {
  BaseEntity.apply(this, arguments)
  this.type = 'portal'
}

BasePortal.prototype = new BaseEntity()
BasePortal.prototype.constructor = BasePortal

exports.BasePortal = BasePortal

var BasePowerup = function () {
  BaseEntity.apply(this, arguments)
  this.type = 'powerup'
}

BasePowerup.prototype = new BaseEntity()
BasePowerup.prototype.constructor = BasePowerup

exports.BasePowerup = BasePowerup
