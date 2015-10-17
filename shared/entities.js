var BaseUnportableWall = function () {
  this.id

  this.grid_x
  this.grid_y

  this.portable = false
}

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = BaseUnportableWall
  }
  exports.BaseUnportableWall = BaseUnportableWall
} else {
  window['BaseUnportableWall'] = BaseUnportableWall
}
