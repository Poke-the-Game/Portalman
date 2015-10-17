var session = new window.SessionManager(window.io())

session.start(function (socket) {
  window.client = new window.Game(socket)
})
