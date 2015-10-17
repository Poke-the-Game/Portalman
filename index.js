var express = require('express')
var http = require('http')
var socketIO = require('socket.io')

var SessionManager = require('./lib/sessionManager.js').SessionManager

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
var sessionManager = new SessionManager(io)
sessionManager.listen(io)
