import values from './../values.js'

const day  = 18
const part = 1

const {testInput, input} = values
const expectedTestResult = 62

class Task {
  constructor(input) {
    this.input        = input
    this.instructions = []
    this.grid         = []

    this.total = 0

    this.prepareGrid()
  }

  run() {
    this.drawPath()
    this.clearOutside()

    this.grid.forEach((row) => {
      row.forEach((cell) => {
        if (cell != '.' && cell != '#') return
        this.total++
      })
    })

    return this.total
  }

  drawPath() {
    let row = Math.floor(this.rowCount / 2)
    let col = Math.floor(this.colCount / 2)

    this.instructions.forEach((instruction) => {
      let {direction, count, color} = instruction
      let target

      if (direction == 'R') {
        target = col + count
        while (col < target) { this.grid[row][col] = '#'; col++ }
      }
      else if (direction == 'L') {
        target = col - count
        while (col > target) { this.grid[row][col] = '#'; col-- }
      }
      else if (direction == 'D') {
        target = row + count
        while (row < target) { this.grid[row][col] = '#'; row++ }
      }
      else if (direction == 'U') {
        target = row - count
        while (row > target) { this.grid[row][col] = '#'; row-- }
      }
    })
  }

  clearOutside() {
    let cellsToClear = []
    let next = [0, 0]

    while (next != undefined) {
      const [row, col] = next
      const offsets    = [[-1, 0], [1, 0], [0, -1], [0, 1]]

      offsets.forEach(([rowOffset, colOffset]) => {
        let nextRow = row + rowOffset
        let nextCol = col + colOffset

        if (this.grid[nextRow] == undefined)          return
        if (this.grid[nextRow][nextCol] == undefined) return
        if (this.grid[nextRow][nextCol] != '.')       return

        this.grid[nextRow][nextCol] = ' '
        cellsToClear.push([nextRow, nextCol])
      })

      next = cellsToClear.pop()
    }
  }

  printGrid() {
    this.grid.forEach((row) => { console.log(row.join('')) })
  }

  prepareGrid() {
    let rows = this.input.replace(/^\n/, '')
                         .replace(/\n$/, '')
                         .replace(/\\/g, '╲')
                         .replace(/\//g, '╱')
                         .split('\n')

    this.colCount = 2
    this.rowCount = 2

    this.instructions = rows.map((row) => {
      let [direction, count, color ] = row.split(' ')
      count = parseInt(count)

      switch (direction) {
        case 'R': this.colCount += count; break
        case 'D': this.rowCount += count; break
        case 'L': this.colCount += count; break
        case 'U': this.rowCount += count; break
      }
      return {direction, count, color}
    })

    this.colCount += 2 // Allow some padding, lol
    this.rowCount += 2 // Allow some padding, lol

    for (let i = 0; i <= this.rowCount; i++) {
      this.grid[i] = []

      for (let j = 0; j<= this.colCount; j++) {
        this.grid[i].push('.')
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
