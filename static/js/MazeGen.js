var MazeGen = function MazeGen (sizeX, sizeY) {
  this.sizeX = sizeX
  this.sizeY = sizeY
  this.grid = new Array(sizeX)

  for (var i = 0 ; i < sizeX ; i++) {
    this.grid[i] = []
    for (var j = 0 ; j < sizeY ; j++) {
      this.grid[i].push({

        // walls
        'left': true,
        'right': true,
        'top': true,
        'bottom': true,

        // coords and state
        'visited': false,
        'x': i,
        'y': j
      })
    }
  }

  //setup a grid
  this.visit(this.grid[0][0])
}

MazeGen.prototype.getNeighbours = function (cell) {
  var self = this

  var x = cell.x
  var y = cell.y

  return [
    [x - 1, y, 'left'],
    [x + 1, y, 'right'],
    [x, y + 1, 'top'],
    [x, y - 1, 'down']
  ].filter(function (e, idx) {
    var x = e[0]
    var y = e[1]

    return (
      (x >= 0) &&
      (x < self.sizeX) &&
      (y >= 0) &&
      (y < self.sizeY)
    )
  }).map(function (e, idx) {
    return [self.grid[e[0]][e[1]], e[2]]
  })
}

MazeGen.prototype.select = function (arr) {
  var rnd = Math.floor(Math.random() * arr.length)
  return arr.splice(rnd, 1)
}

MazeGen.prototype.visit = function (cell) {
  // if we have already visited, move on
  if (cell.visited) {
    return
  }

  // mark us as visited
  cell.visited = true

  // get all the unvisited neighbouts
  var neighbours = this.getNeighbours(cell)
  var elem

  while (neighbours.length > 0) {
    elem = this.select(neighbours)

    // check that it was not yet visited
    if (elem[0].visited) {
      continue
    }

    // remove the appropriate wall
    switch (elem[1]) {
      case 'left':
        cell.left = false
        elem[0].right = false
        break
      case 'right':
        cell.right = false
        elem[0].left = false
        break
      case 'top':
        cell.top = false
        elem[0].bottom = false
        break
      case 'bottom':
        cell.bottom = false
        elem[0] = true
        break
    }

    // and go through the sub cell
    this.visit(cell)
  }

  // write back the cell
  this.grid[cell.x][cell.y] = cell
}

module.exports.MazeGen = MazeGen
