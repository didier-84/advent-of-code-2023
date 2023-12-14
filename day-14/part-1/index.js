import values  from './../values.js'

const day  = 14
const part = 1

const {testInput, input} = values
const expectedTestResult = 136

class Task {
  constructor(input) {
    this.input  = input
    this.grid = []

    this.prepareGrid()
  }

  run() {
    this.tiltGridToNorth()

    return this.grid.reduce((acc, row, index) => {
      let count  = this.countRocks(row)
      let weight = this.weightFor(index)
      return acc += (count * weight)
    }, 0)
  }

  tiltGridToNorth() {
    let cols = Task.transposeGrid(this.grid)

    cols = cols.map((col) => {
      let parts = col.split('#').map((part) => {
        return part.split('').sort().reverse().join('')
      })
      return parts.join('#')
    })

    this.grid = Task.transposeGrid(cols)
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
