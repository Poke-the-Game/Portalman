var inputs = [];
(function ($) {

  $(function () {
    // TODO: Initialise all the inputs
    inputs.push(new window.KeyboardInput({
      13: 'enter',
      37: 'left', // LEFT arrow
      38: 'up', // UP arrow
      39: 'right', // right arrow
      40: 'down', // down arrow
      87: 'up', // W
      65: 'left', // A
      83: 'down', // S
      68: 'right' // D
    }))

    window.addEventListener('userInput', function (evt) {
      if (evt.detail.state) {
        var item = $('div.menu a.selected')
        switch (evt.detail.input) {
          case 'up':
            if (item.prev('a').length) {
              item.removeClass('selected')
                .prev().addClass('selected')
            }
            break
          case 'down':
            if (item.next('a').length) {
              item.removeClass('selected')
                .next().addClass('selected')
            }
            break
          case 'enter':
            item.click()
            break
        }
      }
    })
  })

  window.buildMenu = function buildMenu (title, items) {
    var menu = $('<div class="menu">')

    menu.append($('<h1>').text(title))

    $.each(items, function (idx, e) {
      menu.append($('<a>').text(e.text).click(e.callback))
    })

    $(menu).children('a').hover(
      function (evt) {
        $('div.menu a').removeClass('selected')
        $(this).addClass('selected')
      }
    ).eq(0).addClass('selected')

    return menu
  }
})(window.jQuery)
