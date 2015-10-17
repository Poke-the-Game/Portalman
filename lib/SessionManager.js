var SessionManager = function(io, next){
  var me = this;

  this.matches = [];
  this.next = next;

  io.on('connection', function(socket){
    socket.on('find_session', function(){
      me.matches.push(socket);
      me.allocateMatches();
    });
  });
};

SessionManager.prototype.allocateMatches = function(){
  var socketa;
  var socketb;

  while(this.matches.length > 1){
    socketa = this.matches.pop();
    socketb = this.matches.pop();

    this.next(socketa, socketb);

    socketa.emit('session_found');
    socketb.emit('session_found');
  };
}

module.exports.SessionManager = SessionManager; 
