var ServerPlayer = require('./serverEntities.js').ServerPlayer

var Game = function () {
  this.players = []
  this.entities = []

  this.maxPlayers = 2

  this.tick = 0
  this.tick_duration = 50

  this.gameLoop = undefined
}

Game.prototype.addPlayer = function (socket) {
  var entity = new ServerPlayer()
  this.addEntity(entity)
  this.players.push({entity: entity, socket: socket})
  return entity
}

Game.prototype.addEntity = function (entity) {
  entity.id = this.entities.length
  this.entities.push(entity)
}

Game.prototype.start = function () {
  console.log('Game commencing')

  this.players.map(function (curr, idx) {
    curr.socket.once('clientReady', function () {
      curr.socket.emit('gameStart', {id: curr.entity.id})
    })
  })

  // physics update
  var _update = this.update.bind(this)
  this.gameLoop = setInterval(_update, this.tick_duration)
}

Game.prototype.stop = function () {
  if (typeof this.gameLoop === 'undefined') {
    return
  }

  clearInterval(this.gameLoop)
  this.gameLoop = undefined

  for (var i in this.players) {
    cur = this.players[i].socket
    cur.disconnect()
  }
}

Game.prototype.update = function () {
  for (var i in this.entities) {
    var cur = this.entities[i]
    cur.update(1)
  }
}

module.exports.Game = Game
