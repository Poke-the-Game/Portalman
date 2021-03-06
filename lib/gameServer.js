var Game = require('./game.js').Game

var GameServer = function GameServer (io, sockets) {
  var self = this
  this.io = io

  this.game = new Game(this)
  sockets.forEach(function (ele) {
    self.addPlayerToServer(ele)
  })

  this.start()

  // send complete world state
  this.worldUpdateInterval = 5000
  var _worldUpdate = this.worldUpdateEvent.bind(this)
  this.worldUpdateLoop = setInterval(_worldUpdate, this.worldUpdateInterval)

  // send diff
  this.tickInterval = 50
  var _tick = this.tickEvent.bind(this)
  this.tickLoop = setInterval(_tick, this.tickInterval)
}

GameServer.prototype.start = function () {
  console.log('Game commencing')

  this.game.players.map(function (curr, idx) {
    curr.socket.once('clientReady', function () {
      curr.socket.emit('gameStart', {
        id: curr.entity.id,
        size: this.game.size,
        entities: this.game.entities.map(function (elem) {
          return elem.serialize()
        })
      })
      this.worldUpdateEvent()
    }.bind(this))
  }.bind(this))

  this.game.start()
}

GameServer.prototype.addPlayerToServer = function (socket) {
  var color1 = ['Blue', 'LightBlue']
  var color2 = ['Orange', 'Purple']

  color1 = color1[this.game.players.length % color1.length]
  color2 = color2[this.game.players.length % color2.length]

  var playerEntity = this.game.addPlayer(socket)
  playerEntity.portal1Color = color1
  playerEntity.portal2Color = color2
  this.initPlayerEvents(socket, playerEntity)
}

GameServer.prototype.isFull = function () {
  return this.game.players.length >= this.game.maxPlayers
}

GameServer.prototype.worldUpdateEvent = function () {
  this.io.sockets.emit('worldUpdate', {
    'entities': this.game.entities.map(function (elem) {
      return elem.serialize()
    })
  })
}

GameServer.prototype.tickEvent = function () {
  var entitiesChangedSinceLastTick = []

  this.game.entities.forEach(function (elem) {
    if (elem.changedSinceLastTick) {
      elem.changedSinceLastTick = false
      entitiesChangedSinceLastTick.push(elem.serialize())
    }
  })
  if (entitiesChangedSinceLastTick.length || this.game.deletedEntities.length) {
    this.io.sockets.emit('tick', {
      'entities': entitiesChangedSinceLastTick,
      'deletedEntities': this.game.deletedEntities.map(function (elem) {
        return elem.serialize()
      })
    })
    this.game.deletedEntities = []
  }
}

GameServer.prototype.initPlayerEvents = function (socket, playerEntity) {
  var self = this
  socket.on('disconnect', function () {
    self.stop()
  })
  socket.on('tick', function (data) {
    playerEntity.inputState = data
  })
}

GameServer.prototype.stop = function () {
  if (typeof this.worldUpdateLoop === 'undefined') {
    return
  }

  clearInterval(this.worldUpdateLoop)
  this.worldUpdateLoop = undefined

  this.game.stop()
}

module.exports.GameServer = GameServer
