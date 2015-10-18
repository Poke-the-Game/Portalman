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
    'portal': this.canPortal ? {
      'top': typeof this.portal.top !== 'boolean' ? this.portal.top[0].id : this.portal.top,
      'right': typeof this.portal.right !== 'boolean' ? this.portal.right[0].id : this.portal.right,
      'left': typeof this.portal.left !== 'boolean' ? this.portal.left[0].id : this.portal.left,
      'bottom': typeof this.portal.bottom !== 'boolean' ? this.portal.bottom[0].id : this.portal.bottom
    } : undefined
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
  this.explosionRange = 3
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
