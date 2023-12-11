import values from './../values.js'

const day  = 11
const part = 1

const {testInput, input} = values
const expectedTestResult = 374

class Task {
  constructor(input) {
    this.input    = input
    this.universe = []
    this.rows     = []
    this.columns  = {}
    this.pairs    = []

    this.prepareUniverse()
  }

  run() {
    let galaxies = this.findGalaxies()
    this.pairGalaxiesAndComputeDistance(galaxies)

    return this.pairs.reduce((acc, number) => (acc + number), 0)
  }

  findGalaxies() {
    let galaxies = []
    let galaxyId = 0

    this.universe.forEach((row, rowIndex) => {
      row.forEach((tile, colIndex) => {
        if (tile != '#') return

        galaxies.push({galaxyId, y: rowIndex, x: colIndex})
        galaxyId++
      })
    })

    return galaxies
  }

  pairGalaxiesAndComputeDistance(galaxies) {
    for (let i = 0; i < galaxies.length; i++) {
      for (let j = i+1; j < galaxies.length; j++) {
        this.pairs.push(this.computeDistance(galaxies[i], galaxies[j]))
      }
    }
  }

  computeDistance(a, b) {
    let x = (a.x >= b.x) ? (a.x - b.x) : (b.x - a.x)
    let y = (a.y >= b.y) ? (a.y - b.y) : (b.y - a.y)

    return (x + y)
  }

  prepareUniverse() {
    this.rows = this.input.replace(/^\n/,     '')
                          .replace(/\n$/,     '')
                          .split('\n')

    this.addRowsAndExtraRows()
    this.addExtraColumns()
  }

  addRowsAndExtraRows() {
    let galaxiesInRow = 0

    for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
      let row = this.rows[rowIndex]

      row.split('').forEach((tile, colIndex) => {
        if (tile == '#') galaxiesInRow++

        if (this.columns[colIndex] == undefined) {
          this.columns[colIndex] = tile
        } else {
          this.columns[colIndex] += tile
        }
      })

      this.universe.push(row)

      if (galaxiesInRow == 0) this.universe.push(row)
      galaxiesInRow = 0
    }
  }

  addExtraColumns() {
    // Filter-out columns with galaxies
    for (let colIndex in this.columns) {
      if (this.columns[colIndex].includes('#')) {
        delete this.columns[colIndex]
      }
    }

    this.universe = this.universe.map((row) => {
      for (let colIndex = row.length; colIndex > 0; colIndex--) {
        if (this.columns[colIndex] != undefined) {
          row = [row.slice(0, colIndex), '.', row.slice(colIndex)].join('')
        }
      }
      return row.split('')
    })
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
