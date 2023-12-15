import Line   from './Line.js'
import values from './../values.js'

const day  = 12
const part = 2

const {testInput, input} = values
const expectedTestResult = 525152

class Task {
  constructor(input) {
    this.input = input
    this.lines = []
    this.cache = {}
  }

  run() {
    this.prepareLines()

    return this.lines.reduce((acc, line) => {
      return acc + this.processLine(line)
    }, 0)
  }

  processLine(line) {
    // Bit of cleaning first
    line.clearAllTrailingGroups()
    line.clearAllLeadingGroups()

    let total  = line.countTotalArrangements(this.cache)
    this.cache = line.cache
    return total
  }

  prepareLines() {
    let lines = this.input.replace(/^\n/,     '')
                          .replace(/\n$/,     '')
                          .split('\n')

    this.lines = lines.map((line) => new Line(line))
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
