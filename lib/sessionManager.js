var EventEmitter = require('events').EventEmitter
var util = require('util')
var GameServer = require('./gameServer.js').GameServer

var SessionManager = function (io) {
  this.io = io

  this.matches = []
  this.games = []
}

util.inherits(SessionManager, EventEmitter)

SessionManager.prototype.allocateMatches = function () {
  var me = this
  var game
  var socketa
  var socketb

  // remove full games from the array
  for (var i = 0; i < this.games.length; i++) {
    game = this.games[i]

    // remove a game it is is full
    if (game.game.players.length >= game.game.maxPlayers) {
      this.games.splice(i, 1)
      i--
    }
  }

  // add players to non-full games one-by-one
  for (var j = 0; j < this.games.length && this.matches.length > 0; j++) {

    // take a player from the stack
    socketa = this.matches.pop()

    // emit a nice event
    me.emit('player_added', socketa)
    this.games[j].game.addPlayer(socketa)

    // and do some logging
    console.log('player_added', socketa.id)
  }

  while (this.matches.length > 1) {
    // pop two sockets from the stack
    socketa = this.matches.pop()
    socketb = this.matches.pop()

    // do some logging
    console.log('new_session', socketa.id, socketb.id)

    // create a new session with them
    me.emit('new_session', socketa, socketb)
    me.games.push(new GameServer(this.io, [socketa, socketb]))

    // and tell the sessions we actually found them
    socketa.emit('session_found')
    socketb.emit('session_found')
  };
}

SessionManager.prototype.listen = function (io) {
  var me = this

  io.on('connection', function (socket) {
    socket.on('find_session', function () {
      me.matches.push(socket)
      me.allocateMatches()
    })
  })
}

module.exports.SessionManager = SessionManager
