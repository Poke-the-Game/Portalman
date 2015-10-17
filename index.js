var express = require('express')
var http = require('http')
var socketIO = require('socket.io')

var SessionManager = require('./lib/SessionManager').SessionManager
var GameServer = require('./lib/GameServer').GameServer

// create express server and serve the static directory
var app = express()
app.use(express.static(__dirname + '/static'))

// create an http server and listen on the right port
var server = http.Server(app)
server.listen(process.env.PORT || 3000, function () {
  console.log('listening on *:3000')
})

// create a socket io server and run the session manager
var io = socketIO(server)

// create a session manager
var sessionManager = new SessionManager()
sessionManager.on('new_session', function (socket1, socket2) {
  return new GameServer(socket1, socket2)
})
sessionManager.listen(io)
