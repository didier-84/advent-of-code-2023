import values from './../values.js'

const day  = 21
const part = 1

const {testInput, input} = values
const expectedTestResult = 16

const testSteps = 6
const realSteps = 64

class Task {
  constructor(input, steps) {
    this.input = input
    this.steps = steps
    this.grid  = []
    this.start = []

    this.total = 0

    this.prepareGrid()
  }

  run() {
    let offsets = [[0, 1], [0, -1], [1, 0], [-1, 0]]
    let tiles = [JSON.stringify(this.start)]

    for (let step = 0; step < this.steps; step++) {
      let nextTiles = new Set()

      tiles.forEach((tile) => {
        tile = JSON.parse(tile)

        offsets.forEach((offset) => {
          let i = tile[0] + offset[0]
          let j = tile[1] + offset[1]

          if (this.grid[i]    === undefined) return
          if (this.grid[i][j] === undefined) return
          if (this.grid[i][j] == '#')        return

          nextTiles.add(JSON.stringify([i, j]))
        })
      })

      tiles = [...nextTiles]
    }

    return tiles.length
  }

  printGrid() {
    this.grid.forEach((row) => { console.log(row.join('')) })
  }

  prepareGrid() {
    let rows = this.input.replace(/^\n/, '')
                         .replace(/\n$/, '')
                         .split('\n')

    this.rowCount = rows.length
    this.colCount = rows[0].length

    this.grid = rows.map((row, i) => {
      let tiles = row.split('')

      if (tiles.indexOf('S') != -1 ) {
        this.start = [i, tiles.indexOf('S')]
      }

      return tiles
    })
  }
}

console.log(`# Day ${day} - Part ${part} #`)
console.log('----------------')

const testResult = new Task(testInput, testSteps).run()

console.log(' Test:')
console.log(' - Expected result: ' + expectedTestResult)
console.log(' - Computed result: ' + testResult)

console.log('----------------')

const realResult = new Task(input, realSteps).run()

console.log(' Real task:')
console.log(' - Computed result: ' + realResult)
