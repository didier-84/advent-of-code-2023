import values from './../values.js'

const day  = 16
const part = 1

const {testInput, input} = values
const expectedTestResult = 46

class Task {
  constructor(input) {
    this.input = input
    this.tiles = {}

    this.history   = {}
    this.nextTiles = []

    this.energized = new Set()

    this.prepareTiles()
  }

  run() {
    let startKey  = '0-0'
    let direction = 'E'

    this.followBeam(startKey, direction)

    while (this.nextTiles.length > 0) {
      let {tileKey, direction} = this.nextTiles.shift()
      this.followBeam(tileKey, direction)
    }

    return this.energized.size
  }

  followBeam(tileKey, direction) {
    if (this.tiles[tileKey] == undefined) return

    this.energized.add(tileKey)

    let tile = this.tiles[tileKey]

    switch (tile.char) {
      case '.': return this.letBeamThrough(tile, direction)
      case '|': return this.processVerticalPipeTile(tile, direction)
      case '-': return this.processHorizontalPipeTile(tile, direction)
      case '╲': return this.processBackslashTile(tile, direction)
      case '╱': return this.processSlashTile(tile, direction)
    }
  }

  processVerticalPipeTile(tile, direction) {
    if ('NS'.includes(direction)) {
      this.letBeamThrough(tile, direction)
    } else {
      this.splitBeamVertically(tile)
    }
  }

  processHorizontalPipeTile(tile, direction) {
    if ('WE'.includes(direction)) {
      this.letBeamThrough(tile, direction)
    } else {
      this.splitBeamHorizontally(tile)
    }
  }

  processBackslashTile(tile, direction) {
    switch(direction) {
      case 'N': return this.addToNextTiles(`${tile.row}-${tile.col - 1}`, 'W')
      case 'S': return this.addToNextTiles(`${tile.row}-${tile.col + 1}`, 'E')
      case 'E': return this.addToNextTiles(`${tile.row + 1}-${tile.col}`, 'S')
      case 'W': return this.addToNextTiles(`${tile.row - 1}-${tile.col}`, 'N')
    }
  }

  processSlashTile(tile, direction) {
    switch(direction) {
      case 'N': return this.addToNextTiles(`${tile.row}-${tile.col + 1}`, 'E')
      case 'S': return this.addToNextTiles(`${tile.row}-${tile.col - 1}`, 'W')
      case 'E': return this.addToNextTiles(`${tile.row - 1}-${tile.col}`, 'N')
      case 'W': return this.addToNextTiles(`${tile.row + 1}-${tile.col}`, 'S')
    }
  }

  letBeamThrough(tile, direction) {
    switch(direction) {
      case 'N': return this.addToNextTiles(`${tile.row - 1}-${tile.col}`, direction)
      case 'S': return this.addToNextTiles(`${tile.row + 1}-${tile.col}`, direction)
      case 'E': return this.addToNextTiles(`${tile.row}-${tile.col + 1}`, direction)
      case 'W': return this.addToNextTiles(`${tile.row}-${tile.col - 1}`, direction)
    }
  }

  splitBeamVertically(tile) {
    this.addToNextTiles(`${tile.row - 1}-${tile.col}`, 'N')
    this.addToNextTiles(`${tile.row + 1}-${tile.col}`, 'S')
  }

  splitBeamHorizontally(tile) {
    this.addToNextTiles(`${tile.row}-${tile.col - 1}`, 'W')
    this.addToNextTiles(`${tile.row}-${tile.col + 1}`, 'E')
  }

  addToNextTiles(tileKey, direction) {
    let key = JSON.stringify(tileKey + direction)
    if (this.history[key] !== undefined) return

    this.history[key] = 1
    this.nextTiles.push({ tileKey, direction })
  }

  prepareTiles() {
    let rows = this.input.replace(/^\n/, '')
                         .replace(/\n$/, '')
                         .replace(/\\/g, '╲')
                         .replace(/\//g, '╱')
                         .split('\n')

    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < rows[0].length; j++) {
        let key = `${i}-${j}`
        this.tiles[key] = {
          char: rows[i][j],
          row:  i,
          col:  j
        }
      }
    }
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
