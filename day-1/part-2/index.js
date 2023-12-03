import values from './../values.js'

const day  = 1
const part = 2

const {testInputPartTwo: testInput, input} = values
const expectedTestResult = 281

class Task {
  constructor (input) {
    this.input = input
    this.sum   = 0
  }

  run() {
    const lines = this.input.replace(/eight/g, "eeight")
                            .replace(/one/g,   "oone")
                            .replace(/nine/g,  "nnine")
                            .replace(/two/g,   "ttwo")
                            .split('\n')

    const table = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
    const regex = new RegExp('\\d|' + table.join('|'), 'g')

    return lines.reduce((acc, line) => {
      if (line.length == 0) return acc

      const digits = line.match(regex)

      let first = digits[0]
      if (table.indexOf(first) != -1) {
        first = table.indexOf(first).toString()
      }

      let last = digits[digits.length - 1]
      if (table.indexOf(last) != -1) {
        last = table.indexOf(last).toString()
      }

      return acc + parseInt(first + last)
    }, 0)
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
