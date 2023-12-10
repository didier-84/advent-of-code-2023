import values from './../values.js'

const day  = 1
const part = 1

const {testInputPartOne: testInput, input} = values
const expectedTestResult = 142

class Task {
  constructor (input) {
    this.input = input
    this.sum   = 0
  }

  run() {
    const lines = this.input.split('\n')

    const regex = new RegExp('\\d', 'g')

    return lines.reduce( (acc, line) => {
      if (line.length == 0) return acc

      const digits = line.match(regex)
      const first  = digits[0]
      const last   = digits[digits.length - 1]

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
