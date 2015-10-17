var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http);

var SessionManager = require('./lib/SessionManager').SessionManager;
var GameServer = require('./lib/GameServer').GameServer;


app.use(express.static(__dirname + '/static'))

var port = process.env.PORT || 3000;

http.listen(port, function () {
  console.log('listening on *:3000')
})

// create the session manager
var sessions = new SessionManager(io, function(socket1, socket2){
  new GameServer(socket1, socket2);
});
