var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use(express.static(__dirname + '/static'))

var port = process.env.PORT || 3000;
http.listen(port, function () {
  console.log('listening on *:3000')
})
