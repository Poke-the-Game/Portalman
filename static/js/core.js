var session = new window.SessionManager(window.io())

var theMenu = window.buildMenu('Portalman', [{
  'text': 'Begin',
  'callback': function () {
    // clear the body
    theMenu.remove()
    window.$('body').removeClass('menu')

    // start sessions and stuff
    session.start(function (socket) {
      window.client = new window.Game(socket)
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
    window.$('body')
      .find('*').remove().end()
    .append('<div class="menu"><h1>You quit. So no cake for you. </h1></div>')
  }
}])

theMenu.appendTo('body')
