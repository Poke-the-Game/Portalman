var SimpleMazeGen = function SimpleMazeGen (sizeX, sizeY) {
  this.sizeX = sizeX
  this.sizeY = sizeY
  this.maxX = sizeX - 1
  this.maxY = sizeY - 1
}

/*
  0 - AIR
  1 - PORTAL_WALL
  2 - WALL
  3 - CUBE
*/

SimpleMazeGen.prototype.initGrid = function () {
  this.grid = new Array(this.sizeX)

  for (var i = 0 ; i < this.sizeX ; i++) {
    this.grid[i] = []
    for (var j = 0 ; j < this.sizeY ; j++) {
      this.grid[i].push(0)
    }
  }
}

SimpleMazeGen.prototype.random = function () {
  this.initGrid()

  var self = this

  // Make bounding rectangle
  this.iterGrid(function (x, y) {
    if (x === 0 || x === this.sizeX || y === 0 || y === this.sizeY) {
      self.grid[x][y] = 2 // Set borders to wall
    }
  })

  // Every second block is wall, if not randomly set to cube with P = 0.8
  this.iterGrid(function (x, y) {
    // If not border
    if (x > 1 && x < self.maxX - 1 && y > 1 && y < self.maxY - 1) {
      if (!(x % 2 || y % 2)) {
        self.grid[x][y] = Math.random() > 0.5 ? 2 : 1 // Set to portal wall or normal wall
      } else {
        self.grid[x][y] = Math.random() > 0.8 ? 0 : 3
      }
    }
  })
}

SimpleMazeGen.prototype.printGrid = function () {
  for (var i = 0 ; i < this.sizeX ; i++) {
    var line = ''
    for (var j = 0 ; j < this.sizeY ; j++) {
      line += this.grid[i][j].toString()
    }
    console.log(line)
  }
}

SimpleMazeGen.prototype.iterGrid = function (callback) {
  for (var i = 0 ; i < this.sizeX ; i++) {
    for (var j = 0 ; j < this.sizeY ; j++) {
      callback(i, j)
    }
  }
}

module.exports.SimpleMazeGen = SimpleMazeGen
