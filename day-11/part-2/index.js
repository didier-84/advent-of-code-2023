import values from './../values.js'

const day  = 11
const part = 2

const {testInput, input} = values

const testFactors         = [ 10, 100 ]
const expectedTestResults = [ 1030, 8410 ]

const realFactor = 1000000

class Task {
  constructor(input, factor) {
    this.input    = input
    this.factor   = factor
    this.universe = []
    this.rows     = []
    this.columns  = {}
    this.pairs    = []

    this.emptyRows    = []
    this.emptyColumns = new Set()

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

    this.emptyColumns.forEach((colIndex) => {
      x += this.computeSpaceFactor(a.x, b.x, colIndex)
    })

    this.emptyRows.forEach((rowIndex) => {
      y += this.computeSpaceFactor(a.y, b.y, rowIndex)
    })

    return (x + y)
  }

  computeSpaceFactor(a, b, index) {
    if (a < b && index > a && index < b) {
      return this.factor - 1
    }

    if (b < a && index > b && index < a) {
      return this.factor - 1
    }

    return 0
  }

  prepareUniverse() {
    this.rows = this.input.replace(/^\n/,     '')
                          .replace(/\n$/,     '')
                          .split('\n')

    this.identifyEmptyRows()
    this.identifyEmptyColumns()
  }

  identifyEmptyRows() {
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

      this.universe.push(row.split(''))

      if (galaxiesInRow == 0) {
        this.emptyRows.push(rowIndex)
      }
      galaxiesInRow = 0
    }
  }

  identifyEmptyColumns() {
    // Filter-out columns with galaxies
    for (let colIndex in this.columns) {
      if (this.columns[colIndex].includes('#')) {
        delete this.columns[colIndex]
      }
    }

    this.columns      = Object.keys(this.columns)
    this.emptyColumns = [...this.columns].sort((a, b) => (a - b))
  }
}

console.log(`# Day ${day} - Part ${part} #`)
console.log('----------------')

const firstTestResult = new Task(testInput, testFactors[0]).run()

console.log(' Test 1:')
console.log(' - Expected result: ' + expectedTestResults[0])
console.log(' - Computed result: ' + firstTestResult)

// console.log('----------------')

const secondTestResult = new Task(testInput, testFactors[1]).run()

console.log(' Test 2:')
console.log(' - Expected result: ' + expectedTestResults[1])
console.log(' - Computed result: ' + secondTestResult)

const realResult = new Task(input, realFactor).run()

console.log(' Real task:')
console.log(' - Computed result: ' + realResult)
