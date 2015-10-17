var BaseUnportableWall = require('../shared/player.js').BaseUnportableWall

var ServerUnportableWall = function (grid_x, grid_y) {
  this.grid_x = grid_x
  this.grid_y = grid_y
}

ServerUnportableWall.prototype = new BaseUnportableWall()
