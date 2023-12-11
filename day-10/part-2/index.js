import Tile   from './Tile.js'
import values from './../values.js'

const day  = 10
const part = 2

const {testInputPartTwo: testInput, input} = values
const expectedTestResult = 8

class Task {
  constructor(input) {
    this.input  = input
    this.tiles  = {}
    this.start  = ''
    this.steps  = 0

    this.rowCount    = 0
    this.tilesCount  = 0
    this.currentTile = undefined
    this.direction   = undefined

    this.pathTiles  = []
    this.isExpanded = false

    this.tilesToVisit     = []

    this.prepareTiles()
  }

  run() {
    let directions = ['N', 'E', 'W', 'S']

    directions.forEach((direction) => {
      this.currentTile = this.tiles[this.start]
      this.direction   = direction
      this.findPath()
    })

    this.updateTiles()
    this.expandGrid()
    this.clearOutsideTiles()

    let insideTilesCount = 0

    for (let key in this.tiles) {
      if (this.tiles[key].pipe == '.') {
        insideTilesCount++
      }
    }

    return insideTilesCount
  }

  // Path finding
  findPath() {
    if (this.steps > 0) return

    this.pathTiles   = []
    let nextTileKey  = this.currentTile.nextTileKey(this.direction)
    this.currentTile = this.tiles[nextTileKey]

    if (this.currentTile == undefined)                    return
    if (this.currentTile.isGround())                      return
    if (this.currentTile.isInvalidOrigin(this.direction)) return

    let keepGoing = true

    this.pathTiles.push(nextTileKey)

    while (keepGoing) {
      this.moveToNextTile()
      this.steps = (this.steps > this.tilesCount) ? 0 : this.steps

      keepGoing &&= (this.currentTile != undefined)
      keepGoing &&= (!this.currentTile.isStart())
      keepGoing &&= (this.steps != 0)
    }
  }

  moveToNextTile() {
    this.steps++

    if (this.currentTile.isStart())  return
    if (this.currentTile.isGround()) return this.steps = 0

    this.direction   = this.currentTile.nextDirection(this.direction)
    let nextTileKey  = this.currentTile.nextTileKey(this.direction)
    this.currentTile = this.tiles[nextTileKey]

    if (this.currentTile != undefined) {
      this.pathTiles.push(nextTileKey)
    }
  }

  // Updating tiles before expansion
  updateTiles() {
    for (let key in this.tiles ) {
      if (this.pathTiles.includes(key)) {
        this.tiles[key].isPath = true
      } else {
        this.tiles[key].pipe = '.'
      }
    }

    // The symbol for the start pipe is still "S"
    // We change it to the appropriate symbol, based on the path
    this.replaceStartPipe()
  }

  replaceStartPipe() {
    let startTile = this.tiles[this.start]
    let nextTile  = this.tiles[this.pathTiles[0]]
    let prevTile  = this.tiles[this.pathTiles[this.pathTiles.length - 2]]

    let pipes = Tile.pipeDirectionsMap()

    // Next is on same row
    if (nextTile.rowIndex == startTile.rowIndex) {
      delete pipes['|']
      // Next is east of start
      if (nextTile.colIndex > startTile.colIndex) {
        delete pipes['7']; delete pipes['J']
      } else { // Next is west of start
        delete pipes['F']; delete pipes['L']
      }
    } else { // Next is on same column
      delete pipes['-']
      // Next is north of start
      if (nextTile.rowIndex < startTile.rowIndex) {
        delete pipes['7']; delete pipes['F']
      } else { // Next is souht if start
        delete pipes['J']; delete pipes['L']
      }
    }

    // Prev is on same row
    if (prevTile.rowIndex == startTile.rowIndex) {
      delete pipes['|']
      // Prev is east of start
      if (prevTile.colIndex > startTile.colIndex) {
        delete pipes['7']; delete pipes['J']
      } else { // Prev is west of start
        delete pipes['F']; delete pipes['L']
      }
    } else { // Prev is on same column
      delete pipes['-']
      // Prev is north of start
      if (prevTile.rowIndex < startTile.rowIndex) {
        delete pipes['7']; delete pipes['F']
      } else { // Prev is souht if start
        delete pipes['J']; delete pipes['L']
      }
    }

    this.tiles[this.start].pipe = Object.keys(pipes)[0]
  }

  // Expanding the grid
  expandGrid() {
    this.rowsCount *= 2
    this.colsCount *= 2

    // Add rows
    for (let i = 1; i < this.rowsCount; i += 2) {
      for (let j = 0; j < this.colsCount; j += 2) {
        let newTile = new Tile(' ', i, j)

        let northTile = this.tiles[Tile.tileKeyFor(i-1, j)]
        let southTile = this.tiles[Tile.tileKeyFor(i+1, j)]

        if (southTile != undefined && northTile.isPath && southTile.isPath) {
          if(northTile.canGoSouth() && southTile.canGoNorth() ) {
              newTile.pipe   = '|'
              newTile.isPath = true
          }
        }

        this.tiles[newTile.key] = newTile
      }
    }

    // Add columns
    for (let j = 1; j < this.colsCount; j += 2) {
      for (let i = 0; i < this.rowsCount; i += 1) {

        let newTile = new Tile(' ', i, j)

        let westTile = this.tiles[Tile.tileKeyFor(i, j-1)]
        let eastTile = this.tiles[Tile.tileKeyFor(i, j+1)]

        if (eastTile != undefined && westTile.isPath && eastTile.isPath) {
          if(westTile.canGoEast() && eastTile.canGoWest() ) {
            newTile.pipe   = '-'
            newTile.isPath = true
          }
        }

        this.tiles[newTile.key] = newTile
      }
    }

    this.isExpanded = true
  }

  clearOutsideTiles() {
    // From left and right border
    for (let i = 0; i < this.rowsCount; i++) {
      this.clearTilesFromTileKey(Tile.tileKeyFor(i, 0))
      this.clearTilesFromTileKey(Tile.tileKeyFor(i, this.colsCount - 1))
    }

    // From top and bottom border
    for (let j = 0; j < this.colsCount; j++) {
      this.clearTilesFromTileKey(Tile.tileKeyFor(0, j))
      this.clearTilesFromTileKey(Tile.tileKeyFor(this.rowsCount - 1, j))
    }
  }

  clearTilesFromTileKey(tileKey) {
    this.tilesToVisit.push(tileKey)

    while (this.tilesToVisit.length > 0) {
      let tileKey = this.tilesToVisit.shift()
      let tile    = this.tiles[tileKey]

      if (tile != undefined && !tile.isPath && !tile.isOut) {
        this.tiles[tileKey].pipe  = ' '
        this.tiles[tileKey].isOut = true

        let directions = ['N', 'E', 'W', 'S']

        directions.forEach((direction) => {
          let nextTileKey = tile.nextTileKey(direction)
          if (!this.tilesToVisit.includes(nextTileKey)) {
            this.tilesToVisit.push(nextTileKey)
          }
        })
      }
    }
  }

  // Helper for debug
  printTiles() {
    const factor = this.isExpanded ? 1 : 2;
    const title  = this.isExpanded ? 'Expanded tiles' : 'Original tiles'

    console.log(`${title}\n---------------`)

    for (let i = 0; i < this.rowsCount * factor; i += factor) {
      let line = ''
      for (let j = 0; j < this.colsCount * factor; j += factor) {
        let key = Tile.tileKeyFor(i, j)
        line += this.tiles[key].pipe
      }
      if (line != '') console.log(line)
    }
    console.log('')
  }

  // Preparation methods
  prepareTiles() {
    let rows = this.input.replace(/^\n/,     '')
                         .replace(/\n$/,     '')
                         .split('\n')

    this.rowsCount  = rows.length
    this.colsCount  = rows[0].length
    this.tilesCount = this.rowsCount * this.colsCount

    rows.forEach((row, index) => this.prepareRow(row, index))
  }

  prepareRow(row, rowIndex) {
    row.split('').forEach((tile, index) => this.prepareTile(tile, rowIndex, index))
  }

  prepareTile(tile, rowIndex, colIndex) {
    tile = new Tile(tile, rowIndex, colIndex, 2)

    if (tile.isStart()) {
      this.start = tile.key
    }

    this.tiles[tile.key] = tile
  }
}

console.log(`# Day ${day} - Part ${part} #`)
console.log('----------------')

const testResult = new Task(testInput).run()

console.log(' Test:')
console.log(' - Expected result: ' + expectedTestResult)
console.log(' - Computed result: ' + testResult)

console.log('----------------')

const realResult = new Task(input).run()

console.log(' Real task:')
console.log(' - Computed result: ' + realResult)
