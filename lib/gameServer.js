var Game = require('./game.js').Game

var GameServer = function GameServer (io, sockets) {
  var self = this
  this.io = io

  this.game = new Game()
  sockets.forEach(function (ele) {
    self.addPlayerToServer(ele)
  })

  this.game.start()

  // send complete world state
  this.worldUpdateInterval = 5000
  var _worldUpdate = this.worldUpdateEvent.bind(this)
  this.worldUpdateEvent()
  this.worldUpdateLoop = setInterval(_worldUpdate, this.worldUpdateInterval)

  // send diff
  this.tickInterval = 50
  var _tick = this.tickEvent.bind(this)
  this.tickLoop = setInterval(_tick, this.tickInterval)
}

GameServer.prototype.addPlayerToServer = function (socket) {
  var playerEntity = this.game.addPlayer(socket)
  this.initPlayerEvents(socket, playerEntity)
}

GameServer.prototype.isFull = function () {
  return this.game.players.length >= this.game.maxPlayers
}

GameServer.prototype.worldUpdateEvent = function () {
  console.log('worldUpdate')

  this.io.sockets.emit('worldUpdate', {
    'entities': this.game.entities.map(function (elem) {
      var r = {id: elem.id, type: elem.type, pos: elem.pos, rotation: elem.rotation}
      return r
    })
  })
}

GameServer.prototype.tickEvent = function () {
  console.log('tick')
  var entitiesChangedSinceLastTick = []

  this.game.entities.forEach(function (elem) {
    if (elem.changedSinceLastTick) {
      elem.changedSinceLastTick = false
      entitiesChangedSinceLastTick.push({id: elem.id, type: elem.type, pos: elem.pos, rotation: elem.rotation})
    }
  })
  if (entitiesChangedSinceLastTick.length) {
    this.io.sockets.emit('tick', {
      'entities': entitiesChangedSinceLastTick
    })
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
