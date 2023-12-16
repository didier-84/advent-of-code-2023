import values from './../values.js'

const day  = 16
const part = 1

const {testInput, input} = values
const expectedTestResult = 46

class Task {
  constructor(input) {
    this.input = input
    this.tiles = {}

    this.history   = []
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
      case '.':
        this.letBeamThrough(tile, direction)
        break
      case '|':
        this.processVerticalPipeTile(tile, direction)
        break
      case '-':
        this.processHorizontalPipeTile(tile, direction)
        break
      case '╲':
        this.processBackslashTile(tile, direction)
        break
      case '╱':
        this.processSlashTile(tile, direction)
        break
    }
  }

  processVerticalPipeTile(tile, direction) {
    if ('NS'.includes(direction)) {
      this.letBeamThrough(tile, direction)
    } else {
      this.splitBeam(tile)
    }
  }

  processHorizontalPipeTile(tile, direction) {
    if ('WE'.includes(direction)) {
      this.letBeamThrough(tile, direction)
    } else {
      this.splitBeam(tile)
    }
  }

  processBackslashTile(tile, direction) {
    let nextTileKey, newDirection = ''

    switch(direction) {
      case 'N':
        nextTileKey  = `${tile.row}-${tile.col - 1}`
        newDirection = 'W'
        break
      case 'S':
        nextTileKey  = `${tile.row}-${tile.col + 1}`
        newDirection = 'E'
        break
      case 'E':
        nextTileKey  = `${tile.row + 1}-${tile.col}`
        newDirection = 'S'
        break
      case 'W':
        nextTileKey  = `${tile.row - 1}-${tile.col}`
        newDirection = 'N'
        break
    }

    return this.addToNextTiles(nextTileKey, newDirection)
  }

  processSlashTile(tile, direction) {
    let nextTileKey, newDirection = ''

    switch(direction) {
      case 'N':
        nextTileKey  = `${tile.row}-${tile.col + 1}`
        newDirection = 'E'
        break
      case 'S':
        nextTileKey  = `${tile.row}-${tile.col - 1}`
        newDirection = 'W'
        break
      case 'E': // /
        nextTileKey  = `${tile.row - 1}-${tile.col}`
        newDirection = 'N'
        break
      case 'W':
        nextTileKey  = `${tile.row + 1}-${tile.col}`
        newDirection = 'S'
        break
    }

    return this.addToNextTiles(nextTileKey, newDirection)
  }

  letBeamThrough(tile, direction) {
    let nextTileKey = ''

    switch(direction) {
      case 'N':
        nextTileKey = `${tile.row - 1}-${tile.col}`
        break
      case 'S':
        nextTileKey = `${tile.row + 1}-${tile.col}`
        break
      case 'E':
        nextTileKey = `${tile.row}-${tile.col + 1}`
        break
      case 'W':
        nextTileKey = `${tile.row}-${tile.col - 1}`
        break
    }
    return this.addToNextTiles(nextTileKey, direction)
  }

  splitBeam(tile) {
    let keyA, keyB = ''

    if (tile.char == '-') {
      keyA = `${tile.row}-${tile.col - 1}`
      keyB = `${tile.row}-${tile.col + 1}`

      this.addToNextTiles(keyA, 'W')
      this.addToNextTiles(keyB, 'E')
    } else {
      keyA = `${tile.row - 1}-${tile.col}`
      keyB = `${tile.row + 1}-${tile.col}`

      this.addToNextTiles(keyA, 'N')
      this.addToNextTiles(keyB, 'S')
    }
  }

  addToNextTiles(tileKey, direction) {
    let key = JSON.stringify(tileKey + direction)
    if (this.history.indexOf(key) >= 0) return

    this.history.push(key)
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
