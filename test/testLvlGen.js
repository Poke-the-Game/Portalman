// test maze gen
var LvlGen = require('./SimpleMazeGen.js').SimpleMazeGen
var G = new LvlGen(32, 32)

G.random()
G.printGrid()
