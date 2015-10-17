var session = new window.SessionManager(window.io())

var theMenu = window.buildMenu('Portalman', [{
  'text': 'Begin',
  'callback': function () {
    session.start(function (socket) {
      window.client = new window.Game(socket)
    })
  }
}, {
  'text': 'About',
  'callback': function () {
    console.log('FU2')
  }
}, {
  'text': 'Quit',
  'callback': function () {
    $('body').find('*').remove()
  }
}])

theMenu.appendTo('body')
