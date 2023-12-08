import values from './../values.js'

const day  = 8
const part = 1

const {testInput, input} = values
const expectedTestResult = 6

class Task {
  constructor(input) {
    this.input = input
    this.total = 0

    this.steps = []
    this.nodes = {}

    this.prepareStepsAndNodes()
  }

  run() {
    let nodeId = 'AAA'
    let steps  = []

    while (nodeId != 'ZZZ') {
      if (steps.length == 0) steps = [...this.steps]

      let move = steps.shift()
      nodeId = this.nodes[nodeId][move]

      this.total++
    }

    return this.total
  }

  prepareStepsAndNodes() {
    this.input = this.input.replace(/^\n/,     '')
                           .replace(/\n$/,     '')
                           .replace(/[\(\)]/g, '')

    let [ head, body ] = this.input.split('\n\n')

    this.steps = head.split('')

    body.split('\n').forEach((line) => {
      let [ nodeId, nextNodes ] = line.split(' = ')
      let [ L, R ] = nextNodes.split(', ')
      this.nodes[nodeId] = { L, R }
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
