window.session = new window.SessionManager(window.io({'reconnection': false}))

var theMenu = window.buildMenu('Portalman', [{
  'text': 'Begin',
  'callback': function () {
    // clear the body
    theMenu.detach()
    window.hideInfo()

    // add a waiting message
    window.showInfo('Waiting for opponent...')

    // start sessions and stuff
    window.session.start(function (socket) {
      window.client = new window.Game(socket, function () {
        theMenu.detach()
        window.hideInfo()

        window.$('body').removeClass('menu')
      })
    })
  }
}, {
  'text': 'About',
  'callback': function () {
    window.$('div.info')
    .html('<p>This game combines Bomberman with aspects from Portal. Key controls are WASD to move, left/right click to shoot portals, and use the spacebar to place your bombs.</p><p><a href="https://github.com/Poke-the-Game/Portalman">Code</a> by Tom, Kim, Moritz and Leonhard</p>')
    .toggle()
  }
}, {
  'text': 'Quit',
  'callback': function () {
    // clear the menu
    theMenu.detach()

    // and add a message.
    theMenu = window.buildMenu('You quit. So no cake for you. ', [])
    theMenu.appendTo('body')
  }
}])

window.theMenu = theMenu

theMenu.appendTo('body')
