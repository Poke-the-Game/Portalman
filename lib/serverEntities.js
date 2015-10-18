var BasePlayer = require('../shared/entities.js').BasePlayer
var BaseWall = require('../shared/entities.js').BaseWall
var BaseCube = require('../shared/entities.js').BaseCube
var BaseBomb = require('../shared/entities.js').BaseBomb
var BasePortal = require('../shared/entities.js').BasePortal
var BasePowerup = require('../shared/entities.js').BasePowerup

var bresenham = require('./bresenham')

var ServerPlayer = function (x, y) {
  BasePlayer.apply(this, arguments)
  this.pos = {
    'x': x,
    'y': y
  }
  this.stablePos = {
    'x': x,
    'y': y
  }
  this.portalTo = false
  this.portal1 = false
  this.portal2 = false

  this.targetBlock = false
}
ServerPlayer.prototype = new BasePlayer()
ServerPlayer.prototype.constructor = ServerPlayer
ServerPlayer.prototype.isStable = function (x, y) {
  var positions = [
    [x, y],
    [x + this.size.x, y],
    [x + this.size.x, y + this.size.y],
    [x, y + this.size.y]
  ]

  var xInt
  var xSize = this.game.size.x - 1
  var yInt
  var collisionEntity
  var ySize = this.game.size.y - 1
  var side

  for (var i = 0 ; i < 4 /* positions.length */ ; i++) {
    xInt = Math.min(Math.max(0, Math.floor(positions[i][0])), xSize)
    yInt = Math.min(Math.max(0, Math.floor(positions[i][1])), ySize)

    collisionEntity = this.game.collisionMap[xInt][yInt]

    if (collisionEntity && collisionEntity.owner && collisionEntity.owner.id === this.id) {
      continue
    } else if (collisionEntity && collisionEntity.canPortal) {
      side = collisionEntity.getSide(this.pos.x, this.pos.y, positions[i][0], positions[i][1])

      if (side === 'right' && typeof collisionEntity.portal.right && collisionEntity.portal.right.target) {
        this.portalTo = collisionEntity.portal.right
      } else if (side === 'left' && typeof collisionEntity.portal.left && collisionEntity.portal.left.target) {
        this.portalTo = collisionEntity.portal.left
      } else if (side === 'top' && typeof collisionEntity.portal.top && collisionEntity.portal.top.target) {
        this.portalTo = collisionEntity.portal.top
      } else if (side === 'bottom' && typeof collisionEntity.portal.bottom && collisionEntity.portal.bottom.target) {
        this.portalTo = collisionEntity.portal.bottom
      }
      return false
    } else if (collisionEntity) {
      return false
    }
  }
  return true
}
ServerPlayer.prototype.stabilize = function () {
  if (!this.isStable(this.pos.x, this.pos.y)) {
    this.pos.x = this.stablePos.x
    this.pos.y = this.stablePos.y
  } else {
    this.stablePos.x = this.pos.x
    this.stablePos.y = this.pos.y
  }
}

ServerPlayer.prototype.updatePosition = function (dt) {
  // set positions
  var fac = 1
  var step = 1 / 20
  var lim = -1

  this.portalTo = false
  this.stabilize()

  var _off = 0.1 // TODO -> move the offset to client...


  var dx = this.velocity * dt * fac
  var dy = this.velocity * dt * fac

  if (this.inputState.MOVE_Y > _off) {
    this.inputState.down = Math.abs(this.inputState.MOVE_Y)
    dy *= Math.abs(this.inputState.MOVE_Y)
  }
  if (this.inputState.MOVE_Y < -_off) {
    this.inputState.up = Math.abs(this.inputState.MOVE_Y)
    dy *= Math.abs(this.inputState.MOVE_Y)
  }
  if (this.inputState.MOVE_X > _off) {
    this.inputState.right = Math.abs(this.inputState.MOVE_X)
    dx *= Math.abs(this.inputState.MOVE_X)
  }
  if (this.inputState.MOVE_X < -_off) {
    this.inputState.left = Math.abs(this.inputState.MOVE_X)
    dx *= Math.abs(this.inputState.MOVE_X)
  }

  if (this.inputState.up) {
    while (!this.isStable(this.pos.x, this.pos.y - dy) && fac > lim) {
      fac -= step
    }
    if (fac > lim) {
      this.pos.y -= dy
      this.changedSinceLastTick = true
    }
  }
  this.stabilize()
  fac = 1
  if (this.inputState.down) {
    while (!this.isStable(this.pos.x, this.pos.y + dy) && fac > lim) {
      fac -= step
    }
    if (fac > lim) {
      this.pos.y += dy
      this.changedSinceLastTick = true
    }
  }
  this.stabilize()
  fac = 1
  if (this.inputState.left) {
    while (!this.isStable(this.pos.x - dx, this.pos.y) && fac > lim) {
      fac -= step
    }
    if (fac > lim) {
      this.pos.x -= dx
      this.changedSinceLastTick = true
    }
  }
  this.stabilize()
  fac = 1
  if (this.inputState.right) {
    while (!this.isStable(this.pos.x + dx, this.pos.y) && fac > lim) {
      fac -= step
    }
    if (fac > lim) {
      this.pos.x += dx
      this.changedSinceLastTick = true
    }
  }
  this.stabilize()
}

ServerPlayer.prototype.updateRotation = function () {
  var gunX = this.inputState.GUN_X
  var gunY = this.inputState.GUN_Y

  var newRotation = ((Math.atan2(-gunX, gunY) / (2 * Math.PI)) * 360) + 180

  if (!isNaN(newRotation) && this.rotation !== newRotation) {
    this.rotation = newRotation
    this.changedSinceLastTick = true
  }
}

ServerPlayer.prototype.updateBomb = function () {
  if (this.inputState.space) {
    this.placeBomb()
    this.changedSinceLastTick = true
  }
}

ServerPlayer.prototype.updateTargetBlock = function () {
  var self = this

  var rayLength = 250

  var colMap = this.game.collisionMap

  function isPortalalalalable (x, y) {
    return colMap[x][y].canPortal
  }

  var x1 = Math.floor(this.pos.x) + this.inputState.GUN_X * rayLength
  var y1 = Math.floor(this.pos.y) + this.inputState.GUN_Y * rayLength

  var line = bresenham(this.pos.x, this.pos.y, x1, y1)

  line = line.map(function (e, idx) {
    return {
      'x': Math.round(e.x),
      'y': Math.round(e.y),
      'length': Math.sqrt(Math.pow((e.x - self.pos.x), 2) + Math.pow((e.y - self.pos.y), 2))
    }
  })
  var targetBlock
  var prevBlock = [Math.floor(this.pos.x), Math.floor(this.pos.y)]
  var targetLength
  var targetSide
  var canPortal

  for (var i = 0; i < line.length; i++) {
    if (colMap[line[i].x][line[i].y]) {
      targetBlock = colMap[line[i].x][line[i].y]
      targetLength = line[i].length
      canPortal = isPortalalalalable(line[i].x, line[i].y)
      break
    }

    prevBlock = [Math.round(line[i].x), Math.round(line[i].y)]
  }

  if (targetBlock) {
    // we updated the targetBlock
    this.changedSinceLastTick = true

    // we compute the target side
    if (targetBlock.pos.x + 1 === prevBlock[0] && targetBlock.pos.y === prevBlock[1]) {
      targetSide = 'right'
    } else if (targetBlock.pos.x - 1 === prevBlock[0] && targetBlock.pos.y === prevBlock[1]) {
      targetSide = 'left'
    } else if (targetBlock.pos.x === prevBlock[0] && targetBlock.pos.y + 1 === prevBlock[1]) {
      targetSide = 'bottom'
    } else if (targetBlock.pos.x === prevBlock[0] && targetBlock.pos.y - 1 === prevBlock[1]) {
      targetSide = 'top'
    } else {
      targetSide = undefined
      return
    }

    this.targetBlock = {
      'id': targetBlock.id,
      'pos': targetBlock.pos,
      'canPortal': canPortal,
      'length': targetLength,
      'side': targetSide
    }
  } else {
    this.targetBlock = undefined
  }
}

ServerPlayer.prototype.doPortaling = function () {
  if (this.portalTo) {
    var target = this.portalTo.target
    var side = this.portalTo.targetSide
    var targetX = target.pos.x
    var targetY = target.pos.y

    if (side === 'right') {
      targetX += 1
    } else if (side === 'left') {
      targetX -= 1
    } else if (side === 'top') {
      targetY -= 1
    } else if (side === 'bottom') {
      targetY += 1
    }
    this.portalTo = false
    this.pos.x = targetX
    this.pos.y = targetY
    this.changedSinceLastTick = true
  }
}

ServerPlayer.prototype.firePortal1 = function () {
  // read the block we want to target
  var block = this.game.collisionMap[this.targetBlock.pos.x][this.targetBlock.pos.y]
  var side = this.targetBlock.side

  // check if its side and the block exist
  if (!side || !block) {
    return
  // check if the side is non-empty
  } else if (block.portal[side]) {
    return
  }

  var otherSide
  var otherBlock

  var ancientSide
  var ancientBlock

  if (this.portal2 && this.portal1) {
    // remove the really old portal1s
    ancientBlock = this.portal1.origin
    ancientSide = this.portal1.originSide
    ancientBlock.portal[ancientSide] = false
    ancientBlock.changedSinceLastTick = true
    this.game.deleteEntity(this.portal1)

    // remove the old portal1
    otherBlock = this.portal2.origin
    otherSide = this.portal2.originSide
    otherBlock.portal[otherSide] = false
    otherBlock.changedSinceLastTick = true
    this.game.deleteEntity(this.portal2)

    // register the new portal1
    this.portal1 = new ServerPortal(block, side, otherBlock, otherSide, 'blue')
    block.portal[side] = this.portal1
    block.changedSinceLastTick = true
    this.game.addEntity(this.portal1)

    // register the new portal2
    this.portal2 = new ServerPortal(otherBlock, otherSide, block, side, 'orange')
    otherBlock.portal[otherSide] = this.portal2
    otherBlock.changedSinceLastTick = true
    this.game.addEntity(this.portal2)
  } else if (this.portal1 && !this.portal2) {
    // only portal1 exists => delete it and re-create

    // delete portal1
    ancientBlock = this.portal1.origin
    ancientSide = this.portal1.originSide
    ancientBlock.portal[ancientSide] = false
    ancientBlock.changedSinceLastTick = true
    this.game.deleteEntity(this.portal1)

    // create portal2
    this.portal1 = new ServerPortal(block, side, false, '', 'gray')
    block.portal[side] = this.portal1
    block.changedSinceLastTick = true
    this.game.addEntity(this.portal1)
  } else if (!this.portal1 && this.portal2) {
    // remove old portal2
    otherBlock = this.portal2.origin
    otherSide = this.portal2.originSide
    otherBlock.portal[otherSide] = false
    otherBlock.changedSinceLastTick = true
    this.game.deleteEntity(this.portal2)

    // create portal 1
    this.portal1 = new ServerPortal(block, side, otherBlock, otherSide, 'blue')
    block.portal[side] = this.portal1
    block.changedSinceLastTick = true
    this.game.addEntity(this.portal1)

    // re-create portal2
    this.portal2 = new ServerPortal(otherBlock, otherSide, block, side, 'orange')
    otherBlock.portal[otherSide] = this.portal2
    otherBlock.changedSinceLastTick = true
    this.game.addEntity(this.portal2)
  } else {
    // neither exist => create portal1
    this.portal1 = new ServerPortal(block, side, false, '', 'gray')
    block.portal[side] = this.portal1
    block.changedSinceLastTick = true
    this.game.addEntity(this.portal1)
  }
}

ServerPlayer.prototype.firePortal2 = function () {
  // read the block we want to target
  var block = this.game.collisionMap[this.targetBlock.pos.x][this.targetBlock.pos.y]

  var side = this.targetBlock.side

  // check if its side and the block exist
  if (!side || !block) {
    return
  // check if the side is non-empty
  } else if (block.portal[side]) {
    return
  }

  var otherSide
  var otherBlock

  var ancientSide
  var ancientBlock

  if (this.portal1 && this.portal2) {
    // remove the really old portal2s
    ancientBlock = this.portal2.origin
    ancientSide = this.portal2.originSide
    ancientBlock.portal[ancientSide] = false
    ancientBlock.changedSinceLastTick = true
    this.game.deleteEntity(this.portal2)

    // remove the old portal2
    otherBlock = this.portal1.origin
    otherSide = this.portal1.originSide
    otherBlock.portal[otherSide] = false
    otherBlock.changedSinceLastTick = true
    this.game.deleteEntity(this.portal1)

    // register the new portal2
    this.portal2 = new ServerPortal(block, side, otherBlock, otherSide, 'orange')
    block.portal[side] = this.portal2
    block.changedSinceLastTick = true
    this.game.addEntity(this.portal2)

    // register the new portal1
    this.portal1 = new ServerPortal(otherBlock, otherSide, block, side, 'blue')
    otherBlock.portal[otherSide] = this.portal1
    otherBlock.changedSinceLastTick = true
    this.game.addEntity(this.portal1)
  } else if (this.portal2 && !this.portal1) {
    // only portal2 exists => delete it and re-create

    // delete portal2
    ancientBlock = this.portal2.origin
    ancientSide = this.portal2.originSide
    ancientBlock.portal[ancientSide] = false
    ancientBlock.changedSinceLastTick = true
    this.game.deleteEntity(this.portal2)

    // create portal1
    this.portal2 = new ServerPortal(block, side, false, '', 'gray')
    block.portal[side] = this.portal2
    block.changedSinceLastTick = true
    this.game.addEntity(this.portal2)
  } else if (!this.portal2 && this.portal1) {
    // remove old portal1
    otherBlock = this.portal1.origin
    otherSide = this.portal1.originSide
    otherBlock.portal[otherSide] = false
    otherBlock.changedSinceLastTick = true
    this.game.deleteEntity(this.portal1)

    // create portal 1
    this.portal2 = new ServerPortal(block, side, otherBlock, otherSide, 'orange')
    block.portal[side] = this.portal2
    block.changedSinceLastTick = true
    this.game.addEntity(this.portal2)

    // re-create portal1
    this.portal1 = new ServerPortal(otherBlock, otherSide, block, side, 'blue')
    otherBlock.portal[otherSide] = this.portal1
    otherBlock.changedSinceLastTick = true
    this.game.addEntity(this.portal1)
  } else {
    // neither exist => create portal2
    this.portal2 = new ServerPortal(block, side, false, '', 'gray')
    block.portal[side] = this.portal2
    block.changedSinceLastTick = true
    this.game.addEntity(this.portal2)
  }
}

ServerPlayer.prototype.updateFiredPortals = function () {
  if (this.inputState.fire1 && this.targetBlock && this.targetBlock.canPortal && this.targetBlock.side) {
    this.firePortal1()
  }

  if (this.inputState.fire2 && this.targetBlock && this.targetBlock.canPortal && this.targetBlock.side) {
    this.firePortal2()
  }
}

ServerPlayer.prototype.handlePowerupCollision = function () {
  for (var i in this.game.entities) {
    var cur = this.game.entities[i]
    if (cur.type !== 'powerup') {
      continue
    }

    if (cur.pos.x === Math.round(this.pos.x) && cur.pos.y === Math.round(this.pos.y)) {
      cur.callback(this)
      this.game.deleteEntity(cur)
    }
  }
}

ServerPlayer.prototype.update = function (dt) {
  // rewite the rotation
  this.updateRotation()

  // update the positions
  this.updatePosition(dt)

  // put a bomb
  this.updateBomb()

  // find new target block
  this.updateTargetBlock()

  // find new target block
  this.updateFiredPortals()

  // do some portaling
  this.doPortaling()

  // how about some powerups?
  this.handlePowerupCollision()
}

ServerPlayer.prototype.placeBomb = function () {
  var x = Math.round(this.pos.x)
  var y = Math.round(this.pos.y)

  if (this.game.collisionMap[x][y]) {
    return
  }
  if (this.currentBombNum >= this.maxBombNum) {
    return
  }

  if (!this.game.collisionMap[x][y]) {
    // create the bomb
    var bomb = new ServerBomb(x, y)
    bomb.owner = this
    bomb.changedSinceLastTick = true

    // add it to the game
    this.game.addEntity(bomb)
    this.game.collisionMap[x][y] = bomb

    this.currentBombNum += 1
    bomb.ignite(this)
  }
}
ServerPlayer.prototype.die = function () {
  this.game.killMe(this)
}
ServerPlayer.prototype.disconnect = function () {
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
  this.portals = {
    'top': false,
    'right': false,
    'bottom': false,
    'left': false
  }
}
ServerWall.prototype.getSide = function (x, y, xCol, yCol) {
  var xB = Math.floor(x)
  var yB = Math.floor(y)

  var xA = Math.floor(xCol)
  var yA = Math.floor(yCol)

  // on the top
  if (yB + 1 === yA && xB === xA && typeof this.portal.top !== 'boolean') {
    return 'top'
  }

  // on the right
  if (yB === yA && xB - 1 === xA && typeof this.portal.right !== 'boolean') {
    return 'right'
  }

  // on the top
  if (yB - 1 === yA && xB === xA && typeof this.portal.bottom !== 'boolean') {
    return 'bottom'
  }

  // on the left
  if (yB === yA && xB + 1 === xA && typeof this.portal.left !== 'boolean') {
    return 'left'
  }

  return false
}
ServerCube.prototype = new BaseCube()
ServerCube.prototype.constructor = ServerCube

var ServerBomb = function (x, y) {
  BaseBomb.apply(this, arguments)
  this.pos = {
    'x': x,
    'y': y
  }
  this.exploding = false
  this.player = undefined
}
ServerBomb.prototype = new BaseBomb()
ServerBomb.prototype.constructor = ServerBomb
ServerBomb.prototype.ignite = function (player) {
  this.player = player
  this.bombLoop = setTimeout(function () {
    this.explode()
  }.bind(this), this.diffusionTime)
}
ServerBomb.prototype.explode = function () {
  this.player.currentBombNum -= 1
  this.exploding = true
  clearTimeout(this.bombLoop)
  this.game.deleteEntity(this)
  this.computeDamage(this.pos, this.game)
  this.game.collisionMap[this.pos.x][this.pos.y] = false
}
ServerBomb.prototype.computeDamage = function (origin) {
  // check if player remained on bomb
  for (var i in this.game.players) {
    var entity = this.game.players[i].entity
    var pos = entity.pos
    var gridX = Math.round(pos.x)
    var gridY = Math.round(pos.y)

    if (gridX === origin.x && gridY === origin.y) {
      entity.die()
    }
  }

  // compute fire blaze
  var exploders = []
  exploders.push(this.spreadExplosion(origin, {x: 1, y: 0}))
  exploders.push(this.spreadExplosion(origin, {x: 0, y: 1}))
  exploders.push(this.spreadExplosion(origin, {x: -1, y: 0}))
  exploders.push(this.spreadExplosion(origin, {x: 0, y: -1}))

  this.game.server.io.sockets.emit('explosions', exploders)
}
ServerBomb.prototype.collidesWith = function (player) {
  var positions = [
    [player.pos.x, player.pos.y],
    [player.pos.x + player.size.x, player.pos.y],
    [player.pos.x + player.size.x, player.pos.y + this.size.y],
    [player.pos.x, player.pos.y + player.size.y]
  ]

  var xInt
  var xSize = this.game.size.x - 1
  var yInt
  var ySize = this.game.size.y - 1

  for (var i = 0 ; i < 4 /* positions.length */ ; i++) {
    xInt = Math.min(Math.max(0, Math.floor(positions[i][0])), xSize)
    yInt = Math.min(Math.max(0, Math.floor(positions[i][1])), ySize)

    if (xInt === this.pos.x && yInt === this.pos.y) {
      return true
    }
  }
  return false
}
ServerBomb.prototype.update = function () {
  if (this.owner && !this.collidesWith(this.owner)) {
    this.owner = false
  }
}
ServerBomb.prototype.spreadExplosion = function (origin, direction) {
  var colMap = this.game.collisionMap
  var counter = this.player.explosionRange

  var x = origin.x + direction.x
  var y = origin.y + direction.y
  while (true) {
    var cur = colMap[x][y]

    // check map tiles
    if (cur) {
      if (cur.isDestroyable) {
        this.game.deleteEntity(cur)
        this.game.collisionMap[x][y] = false
        this.game.maybePlacePowerup(x, y)
      } else if (cur.type === 'bomb') {
        if (!cur.exploding) {
          cur.explode()
        }
      } else {
        x -= direction.x
        y -= direction.y
      }
      break
    }

    // check player death
    for (var i in this.game.players) {
      var entity = this.game.players[i].entity
      var pos = entity.pos
      var gridX = Math.round(pos.x)
      var gridY = Math.round(pos.y)

      if (gridX === x && gridY === y) {
        entity.die()
      }
    }

    // check range condition
    counter -= 1
    if (counter <= 0) {
      break
    }

    // travel further on
    x += direction.x
    y += direction.y
  }

  return {start: origin, end: {x: x, y: y}}
}

var ServerPortal = function (origin, originSide, target, targetSide, color) {
  BasePortal.apply(this, arguments)

  this.pos.x = origin.pos.x
  this.pos.y = origin.pos.y

  this.origin = origin
  this.originSide = originSide

  switch (this.originSide) {
    case 'top':
      this.rotation = 0
      break
    case 'right':
      this.rotation = 90
      break
    case 'bottom':
      this.rotation = 180
      break
    case 'left':
      this.rotation = 270
      break
  }

  this.target = target
  this.targetSide = targetSide
  this.color = color
  this.changedSinceLastTick = true
}
ServerPortal.prototype = new BasePortal()
ServerPortal.prototype.constructor = ServerPortal

var ServerPowerup = function (x, y) {
  BasePowerup.apply(this, arguments)
  this.pos = {
    'x': x,
    'y': y
  }
}
ServerPowerup.prototype = new BasePowerup()
ServerPowerup.prototype.constructor = ServerPowerup
ServerPowerup.prototype.callback = function (player) {
  console.log('undefined powerup')
}

module.exports.ServerPlayer = ServerPlayer
module.exports.ServerWall = ServerWall
module.exports.ServerCube = ServerCube
module.exports.ServerBomb = ServerBomb
module.exports.ServerPortal = ServerPortal
module.exports.ServerPowerup = ServerPowerup
