var Game = require('./game.js').Game

var GameServer = function GameServer (io, sockets) {
  var self = this
  this.io = io

  this.game = new Game()
  sockets.forEach(function (ele) {
    self.game.addPlayer(ele)
  })

  this.game.start()

  // send complete world state
  this.worldUpdateInterval = 5000
  var _worldUpdate = this.worldUpdateEvent.bind(this)
  this.worldUpdateEvent()
  this.worldUpdateLoop = setInterval(_worldUpdate, this.worldUpdateInterval)
}

GameServer.prototype.worldUpdateEvent = function () {
  console.log('tick')
  console.log(this.game.players.map(function (cur, i, arr) {
    return cur.getBase()
  }))
  this.io.sockets.emit('worldUpdate', {
    'players': this.game.players.map(function (cur, i, arr) {
      return cur.getBase()
    }),
    'entities': this.game.entities
  })
}

module.exports.GameServer = GameServer
