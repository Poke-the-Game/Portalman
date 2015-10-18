var EventEmitter = require('events').EventEmitter
var util = require('util')
var GameServer = require('./gameServer.js').GameServer

var SessionManager = function (io) {
  this.io = io

  this.clients = []
}

util.inherits(SessionManager, EventEmitter)

SessionManager.prototype.hasClients = function () {
  var client

  for (var i = 0; i < this.clients.length; i++) {
    client = this.clients[i]

    // if we are no longer connected, kick them out
    if (!client.connected) {
      this.clients.splice(i, 1)
      i--
    }
  }

  return this.clients.length > 0
}

SessionManager.prototype.allocateMatches = function () {
  var me = this
  var game
  var socketa
  var socketb

  while (this.hasClients() && this.clients.length > 1) {
    // pop two sockets from the stack
    socketa = this.clients.pop()
    socketb = this.clients.pop()

    // create a new session with them
    me.emit('new_session', socketa, socketb)
    game = new GameServer(this.io, [socketa, socketb])

    // and tell the sessions we actually found them
    socketa.emit('session_found')
    socketb.emit('session_found')
  };

  return game
}

SessionManager.prototype.listen = function (io) {
  var me = this

  io.on('connection', function (socket) {
    socket.on('find_session', function () {
      me.clients.push(socket)
      me.allocateMatches()
    })
  })
}

module.exports.SessionManager = SessionManager
