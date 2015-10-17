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
    if (x === 0 || x === self.sizeX - 1 || y === 0 || y === self.sizeY - 1) {
      self.grid[x][y] = Math.random() > 0.5 ? 1 : 2 // Set borders to wall
    }
  })

  // Every second block is wall, if not randomly set to cube with P = 0.8
  this.iterGrid(function (x, y) {
    // If not border
    if (x > 0 && x < self.sizeX - 1 && y > 0 && y < self.sizeY - 1) {
      if (!(x % 2 || y % 2)) {
        self.grid[x][y] = Math.random() > 0.3 ? 1 : 2 // Set to portal wall or normal wall
      } else {
        self.grid[x][y] = Math.random() < 0.5 ? 0 : 3
      }
    }
  })

  // Top left
  this.grid[1][1] = 0
  this.grid[1][2] = 0
  this.grid[2][1] = 0

  // Top right
  this.grid[this.maxX - 1][1] = 0
  this.grid[this.maxX - 1][2] = 0
  this.grid[this.maxX - 2][1] = 0

  // Bottom right
  this.grid[this.maxX - 1][this.maxY - 1] = 0
  this.grid[this.maxX - 1][this.maxY - 2] = 0
  this.grid[this.maxX - 2][this.maxY - 1] = 0

  // Bottom left
  this.grid[1][this.maxY - 1] = 0
  this.grid[1][this.maxY - 2] = 0
  this.grid[2][this.maxY - 1] = 0

  // Free the corners as start positions for the players
}

SimpleMazeGen.prototype.printGrid = function () {
  var chars = [' ', '░', '█', '*']

  for (var i = 0 ; i < this.sizeY ; i++) {
    var line = ''
    for (var j = 0 ; j < this.sizeX ; j++) {
      line += chars[this.grid[j][i]]
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
