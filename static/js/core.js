var session = new window.SessionManager(window.io({reconnection: false}))

var theMenu = window.buildMenu('Portalman', [{
  'text': 'Begin',
  'callback': function () {
    // clear the body
    theMenu.remove()

    // add a waiting message
    theMenu = window.buildMenu('Waiting for a partner', [])
    theMenu.appendTo('body')

    // start sessions and stuff
    session.start(function (socket) {
      window.client = new window.Game(socket, function () {
        theMenu.remove()
        window.$('body').removeClass('menu')
      })
    })
  }
}, {
  'text': 'About',
  'callback': function () {
    window.alert('We havent done a page for this yet. Come back in 24 hours. ')
  }
}, {
  'text': 'Quit',
  'callback': function () {
    // clear the menu
    theMenu.remove()

    // and add a message.
    theMenu = window.buildMenu('You quit. So no cake for you. ', [])
    theMenu.appendTo('body')
  }
}])

theMenu.appendTo('body')
