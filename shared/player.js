var BasePlayer = function (id) {
  this.id = id

  this.x_pos = 100
  this.y_pos = 100
}

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = BasePlayer
  }
  exports.BasePlayer = BasePlayer
} else {
  window['BasePlayer'] = BasePlayer
}
