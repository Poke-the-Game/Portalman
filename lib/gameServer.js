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
}

GameServer.prototype.addPlayerToServer = function (socket) {
  this.initPlayerEvents(socket)
  this.game.addPlayer(socket)
}

GameServer.prototype.isFull = function () {
  return this.game.players.length < this.game.maxPlayers
}

GameServer.prototype.worldUpdateEvent = function () {
  console.log('tick')

  this.io.sockets.emit('worldUpdate', {
    'players': this.game.players.map(function (cur, i, arr) {
      return cur.getBase()
    }),
    'entities': this.game.entities
  })
}

GameServer.prototype.initPlayerEvents = function (socket) {
  var self = this
  socket.on('disconnect', function () {
    self.stop()
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
