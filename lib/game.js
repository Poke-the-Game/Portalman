var uuid = require('uuid')
var ServerPlayer = require('./serverEntities.js').ServerPlayer
var ServerWall = require('./serverEntities.js').ServerWall
var ServerCube = require('./serverEntities.js').ServerCube
var ServerPortal = require('./serverEntities.js').ServerPortal
var SimpleMazeGen = require('./SimpleMazeGen').SimpleMazeGen

var Game = function (server) {
  this.server = server

  this.players = []
  this.entities = []
  this.deletedEntities = []

  this.maxPlayers = 2

  this.tick = 0
  this.tick_duration = 50

  this.size = {
    'x': 29,
    'y': 29
  }

  // generate a map
  this.map = new SimpleMazeGen(this.size.x, this.size.y)
  this.map.random()

  // and fill an empty collision Map
  this.collisionMap = []
  for (var i = 0 ; i < this.size.x ; i++) {
    this.collisionMap.push([])
    for (var j = 0 ; j < this.size.y ; j++) {
      this.collisionMap[i].push(false)
    }
  }

  this.gameLoop = undefined
  this.lastUpdate = undefined
}

Game.prototype.addPlayer = function (socket) {
  var playPosition = this.map.getStartPositions()[(this.players.length) % 4]
  var entity = new ServerPlayer(playPosition[0], playPosition[1])
  this.addEntity(entity)
  this.players.push({entity: entity, socket: socket})
  return entity
}

Game.prototype.killMe = function (entity) {
  this.players.forEach(function (elem) {
    if (elem.entity.id === entity.id) {
      var sock = elem.socket

      sock.emit('death', {})

      return
    }
  })
}

Game.prototype.addEntity = function (entity) {
  entity.id = uuid.v4()
  entity.game = this
  this.entities.push(entity)
  return entity
}

Game.prototype.deleteEntity = function (entity) {
  for (var i in this.entities) {
    var cur = this.entities[i]
    if (entity.id === cur.id) {
      var del = this.entities.splice(i, 1)[0]
      this.deletedEntities.push(del)
      break
    }
  }
}

Game.prototype.start = function () {
  this.generateGrid()

  // physics update
  this.lastUpdate = Date.now()
  var _update = this.update.bind(this)
  this.gameLoop = setInterval(_update, this.tick_duration)
}

Game.prototype.generateGrid = function () {
  for (var i = 0; i < this.size.x ; i++) {
    for (var j = 0 ; j < this.size.y ; j++) {
      var gridElem = this.map.grid[i][j]
      switch (gridElem) {
        case 1:
          this.collisionMap[i][j] = this.addEntity(new ServerWall(i, j, true))
          break
        case 2:
          this.collisionMap[i][j] = this.addEntity(new ServerWall(i, j, false))
          break
        case 3:
          this.collisionMap[i][j] = this.addEntity(new ServerCube(i, j))
          break
      }
    }
  }
  var portalA = new ServerPortal(this.collisionMap[1][0], 'bottom', this.collisionMap[0][2], 'right', 'orange')
  var portalB = new ServerPortal(this.collisionMap[0][2], 'right', this.collisionMap[1][0], 'bottom', 'blue')

  this.addEntity(portalA)
  this.addEntity(portalB)

  this.collisionMap[1][0].canPortal = true
  this.collisionMap[1][0].portal.bottom = portalA
  this.collisionMap[0][2].canPortal = true
  this.collisionMap[0][2].portal.right = portalB
}

Game.prototype.stop = function () {
  if (typeof this.gameLoop === 'undefined') {
    return
  }

  clearInterval(this.gameLoop)
  this.gameLoop = undefined

  for (var i in this.players) {
    var cur = this.players[i].socket
    cur.disconnect()
  }
}

Game.prototype.update = function () {
  for (var i in this.entities) {
    var cur = this.entities[i]
    var dt = Date.now() - this.lastUpdate

    cur.update(1 / dt)
  }
  this.lastUpdate = Date.now()
}

module.exports.Game = Game
