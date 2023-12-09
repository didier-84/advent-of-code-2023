import values from './../values.js'

const day  = 9
const part = 2

const {testInput, input} = values
const expectedTestResult = 2

class Task {
  constructor(input) {
    this.input = input
    this.lines = []
    this.total = 0

    this.prepareLines()
  }

  run() {
    this.lines.forEach((line) => {
      let number = this.findNextNumber(line)
      this.total += number
    })

    return this.total
  }

  findNextNumber(line) {
    let newLine   = []
    let allZeroes = true

    for (let i = 1; i < line.length; i++) {
      let number = line[i] - line[i-1]
      newLine.push(number)
      allZeroes &&= (number == 0)
    }

    let difference = allZeroes ? 0 : this.findNextNumber(newLine)

    return line[0] - difference
  }

  prepareLines() {
    this.lines = this.input.replace(/^\n/,     '')
                           .replace(/\n$/,     '')
                           .split('\n')

    this.lines = this.lines.map((line) => {
      return line.split(' ').map((number) => parseInt(number))
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
