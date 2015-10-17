var EventEmitter = require('events').EventEmitter
var util = require('util')

var SessionManager = function (io) {
  this.matches = []
}

util.inherits(SessionManager, EventEmitter)

SessionManager.prototype.allocateMatches = function () {
  var me = this
  var socketa
  var socketb

  while (this.matches.length > 1) {
    // pop two sockets from the stack
    socketa = this.matches.pop()
    socketb = this.matches.pop()

    // create a new session with them
    me.emit('new_session', socketa, socketb)

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
