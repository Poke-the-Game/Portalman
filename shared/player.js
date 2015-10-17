var BasePlayer = function () {
  this.id

  this.x_pos
  this.y_pos
}

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = BasePlayer
  }
  exports.BasePlayer = BasePlayer
} else {
  window['BasePlayer'] = BasePlayer
}
