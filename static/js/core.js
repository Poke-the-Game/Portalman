var session = new SessionManager(io());
var client;

session.start(function(socket){
  client = new Game(socket);
});
