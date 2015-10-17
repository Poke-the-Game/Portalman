var uuid = require('uuid')
var ServerPlayer = require('./serverEntities.js').ServerPlayer
var ServerWall = require('./serverEntities.js').ServerWall
var ServerCube = require('./serverEntities.js').ServerCube
var SimpleMazeGen = require('./SimpleMazeGen').SimpleMazeGen

var Game = function () {
  this.players = []
  this.entities = []

  this.maxPlayers = 2

  this.tick = 0
  this.tick_duration = 50

  this.sizeX = 30
  this.sizeY = 30

  this.gameLoop = undefined
  this.lastUpdate = undefined
}

Game.prototype.addPlayer = function (socket) {
  var entity = new ServerPlayer()
  this.addEntity(entity)
  this.players.push({entity: entity, socket: socket})
  return entity
}

Game.prototype.addEntity = function (entity) {
  entity.id = uuid.v1()
  this.entities.push(entity)
}

Game.prototype.start = function () {
  console.log('Game commencing')

  this.generateGrid()

  // physics update
  this.lastUpdate = Date.now()
  var _update = this.update.bind(this)
  this.gameLoop = setInterval(_update, this.tick_duration)
}

Game.prototype.generateGrid = function () {
  var map = new SimpleMazeGen(this.sizeX, this.sizeY)
  map.random()

  for (var i = 0; i < this.sizeX ; i++) {
    for (var j = 0 ; j < this.sizeY ; j++) {
      var gridElem = map.grid[i][j]
      switch (gridElem) {
        case 1:
          this.addEntity(new ServerWall(i, j, true))
          break
        case 2:
          this.addEntity(new ServerWall(i, j, false))
          break
        case 3:
          this.addEntity(new ServerCube(i, j))
          break
      }
    }
  }
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
