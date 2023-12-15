import values from './../values.js'

const day  = 15
const part = 1

const {testInput, input} = values
const expectedTestResult = 1320

class Task {
  constructor(input) {
    this.input   = input
    this.strings = []

    this.prepareStrings()
  }

  run() {
    return this.strings.reduce((acc, string) => (acc + this.processString(string)), 0)
  }

  processString(string) {
    let currentValue = 0

    string.split('').forEach((char) => {
      currentValue += char.charCodeAt(0)
      currentValue *= 17
      currentValue = currentValue % 256
    })
    return currentValue
  }

  prepareStrings() {
    this.strings = this.input.replace(/^\n/, '')
                             .replace(/\n$/, '')
                             .split(',')
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
