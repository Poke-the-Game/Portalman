(function ($) {
  $(function () {
    $(document).keydown(function (evt) {
      var item
      switch (evt.which) {
        case 87: // w
        case 38: // up-arrow
          item = $('div.menu a.selected')
          if (item.prev('a').length) {
            item.removeClass('selected')
              .prev().addClass('selected')
          }
          break

        case 83: // s
        case 40: // down-arrow
          item = $('div.menu a.selected')
          if (item.next('a').length) {
            item.removeClass('selected')
              .next().addClass('selected')
          }

          break
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
