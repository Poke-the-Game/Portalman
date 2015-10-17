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
  this.worldUpdateInterval = 500
  var _worldUpdate = this.worldUpdateEvent.bind(this)
  this.worldUpdateEvent()
  this.worldUpdateLoop = setInterval(_worldUpdate, this.worldUpdateInterval)
}

GameServer.prototype.addPlayerToServer = function (socket) {
  var playerEntity = this.game.addPlayer(socket)
  this.initPlayerEvents(socket, playerEntity)
}

GameServer.prototype.isFull = function () {
  return this.game.players.length >= this.game.maxPlayers
}

GameServer.prototype.worldUpdateEvent = function () {
  console.log('tick')

  this.io.sockets.emit('worldUpdate', {
    'entities': this.game.entities.map(function (elem) {
      var r = {id: elem.id, type: elem.type, pos: elem.pos, rotation: elem.rotation}
      return r
    })
  })
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
