var SessionManager = function SessionManager(socket){
  this.socket = socket;
};

SessionManager.prototype.start = function(next){
  var me = this;

  me.socket
  .once('session_found', function(){
    next(me.socket);
  }).emit('find_session');
};
