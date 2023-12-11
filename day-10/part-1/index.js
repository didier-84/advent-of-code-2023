import values from './../values.js'

const day  = 10
const part = 1

const {testInputPartOne: testInput, input} = values
const expectedTestResult = 8

class Task {
  constructor(input) {
    this.input  = input
    this.tiles  = {}
    this.start  = ''
    this.steps  = 0

    this.tilesCount  = 0
    this.currentTile = undefined
    this.direction   = undefined

    this.prepareTiles()
  }

  run() {
    let directions = ['N', 'E']

    directions.forEach((direction) => {
      this.currentTile = this.tiles[this.start]
      this.direction   = direction
      this.findPath()
    })

    return (this.steps > 1) ? ((this.steps + 1) / 2) : 'Impossible'
  }

  findPath() {
    if (this.steps > 0) return

    let nextTileKey  = this.currentTile.nextTileKey(this.direction)
    this.currentTile = this.tiles[nextTileKey]

    if (this.currentTile == undefined)                    return
    if (this.currentTile.isGround())                      return
    if (this.currentTile.isInvalidOrigin(this.direction)) return

    let keepGoing = true

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
  }

  prepareTiles() {
    let rows = this.input.replace(/^\n/,     '')
                         .replace(/\n$/,     '')
                         .split('\n')

    this.tilesCount = rows.length * rows[0].length

    rows.forEach((row, index) => this.prepareRow(row, index))
  }

  prepareRow(row, rowIndex) {
    row.split('').forEach((tile, index) => this.prepareTile(tile, rowIndex, index))
  }

  prepareTile(tile, rowIndex, colIndex) {
    tile = new Tile(tile, rowIndex, colIndex)

    if (tile.isStart()) {
      this.start = tile.key
    }

    this.tiles[tile.key] = tile
  }
}

class Tile {
  constructor(pipe, rowIndex, colIndex) {
    this.pipe     = pipe
    this.rowIndex = rowIndex
    this.colIndex = colIndex
    this.key      = this.tileKeyFor(rowIndex, colIndex)
  }

  tileKeyFor(rowIndex, colIndex) {
    return `${rowIndex}-${colIndex}`
  }

  nextTileKey(direction) {
    switch(direction) {
      case 'N':
        return this.tileKeyFor(this.rowIndex - 1, this.colIndex)
      case 'S':
        return this.tileKeyFor(this.rowIndex + 1, this.colIndex)
      case 'E':
        return this.tileKeyFor(this.rowIndex, this.colIndex + 1)
      case 'W':
        return this.tileKeyFor(this.rowIndex, this.colIndex - 1)
      }
  }

  isStart() {
    return (this.pipe == 'S')
  }

  isGround() {
    return (this.pipe == '.')
  }

  allDirections() {
    return this.pipeDirectionsMap(this.pipe)
  }

  isInvalidOrigin(direction){
    let opposite   = this.oppositeDirection(direction)
    let directions = this.allDirections()
    return (directions.indexOf(opposite) == -1)
  }

  nextDirection(previous) {
    let [a, b]   = this.pipeDirectionsMap(this.pipe)
    let opposite = this.oppositeDirection(previous)

    return (opposite == a) ? b : a
  }

  oppositeDirection(direction) {
    let map = {'N': 'S', 'S': 'N', 'E': 'W', 'W': 'E'}
    return map[direction]
  }

  pipeDirectionsMap(pipe = '') {
    const map = {
      '|':  ['N', 'S'],
      '-':  ['E', 'W'],
      'L':  ['N', 'E'],
      'J':  ['N', 'W'],
      '7':  ['S', 'W'],
      'F':  ['S', 'E']
    }

    return (pipe == '') ? map : map[pipe]
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
