import values  from './../values.js'

const day  = 14
const part = 2

const {testInput, input} = values
const expectedTestResult = 64

const hugeCycleIndex = 1000000000

class Task {
  constructor(input) {
    this.input  = input
    this.grid = []

    this.cycleCount  = 0
    this.history     = []
    this.patternSize = 0

    this.prepareGrid()
  }

  run() {
    this.findRepeatingPatternSize()
    this.simulateCyclingToHugeCycleIndex()

    return this.computeGridWeight()
  }

  findRepeatingPatternSize() {
    let patternStart = 0
    let patternEnd   = 0
    let keepCycling  = true

    while(keepCycling) {
      let index = this.cycle()

      let currentGrid   = this.grid.join('')
      let matchingIndex = this.history.indexOf(currentGrid)

      if (matchingIndex == -1 ) {
        this.history[index] = currentGrid
      } else {
        keepCycling  = false
        patternStart = matchingIndex
        patternEnd   = index
      }
    }

    this.patternSize = patternEnd - patternStart
  }

  simulateCyclingToHugeCycleIndex() {
    let currentModulo = this.cycleCount % this.patternSize
    let moduloToReach = hugeCycleIndex  % this.patternSize

    while (currentModulo !== moduloToReach) {
      let count = this.cycle()
      currentModulo = count % this.patternSize
    }
  }

  computeGridWeight() {
    return this.grid.reduce((acc, row, index) => {
      let count  = this.countRocks(row)
      let weight = this.weightFor(index)
      return acc += (count * weight)
    }, 0)
  }

  cycle() {
    this.tiltGridVertically(true)    // N
    this.tiltGridHorizontally(true)  // W
    this.tiltGridVertically(false)   // S
    this.tiltGridHorizontally(false) // E

    this.cycleCount++

    return this.cycleCount
  }

  tiltGridVertically(reverse = false) {
    let cols = Task.transposeGrid(this.grid)

    cols = cols.map((col) => {
      let parts = col.split('#').map((part) => {
        part = part.split('').sort()
        if (reverse) {
          part = part.reverse()
        }
        return part.join('')
      })
      return parts.join('#')
    })

    this.grid = Task.transposeGrid(cols)
  }

  tiltGridHorizontally(reverse = false) {
    let cols = this.grid

    cols = cols.map((col) => {
      let parts = col.split('#').map((part) => {
        part = part.split('').sort()
        if (reverse) {
          part = part.reverse()
        }
        return part.join('')
      })
      return parts.join('#')
    })

    this.grid = cols
  }

  countRocks(row) {
    return (row.match(/O/g) || []).length;
  }

  weightFor(index) {
    return this.grid.length - index
  }

  prepareGrid() {
    this.grid = this.input.replace(/^\n/, '')
                          .replace(/\n$/, '')
                          .split('\n')
  }

  // Static method
  static transposeGrid(rows) {
    let cols = []

    for (let i = 0; i < rows[0].length; i++) {
      let col = ''
      for (let j = 0; j < rows.length; j++ ) {
        col += rows[j][i]
      }
      cols.push(col)
    }
    return cols
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
