var session = new window.SessionManager(window.io({reconnection: false}))

var theMenu = window.buildMenu('Portalman', [{
  'text': 'Begin',
  'callback': function () {
    // clear the body
    theMenu.remove()

    // add a waiting message
    window.showInfo('Waiting for a partner...')

    // start sessions and stuff
    session.start(function (socket) {
      window.client = new window.Game(socket, function () {
        theMenu.remove()
        window.hideInfo()

        window.$('body').removeClass('menu')
      })
    })
  }
}, {
  'text': 'About',
  'callback': function () {
    window.$('div.info').toggle()
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

window.theMenu = theMenu

theMenu.appendTo('body')
