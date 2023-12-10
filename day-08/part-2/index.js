import values from './../values.js'

const day  = 8
const part = 2

const {testInputPartTwo: testInput, input} = values
const expectedTestResult = 6

class Task {
  constructor(input) {
    this.input = input

    this.steps = []
    this.nodes = {}

    this.startingNodeIds = []
    this.stepCounts      = []

    this.prepareStepsAndNodes()
    this.findStartingNodes()
  }

  run() {
    let nodeIds = [...this.startingNodeIds]

    nodeIds.forEach((nodeId) => {
      let steps     = []
      let stepCount = 0

      let keepGoing = true

      while(keepGoing) {
        if (steps.length == 0) steps = [...this.steps]

        let move = steps.shift()

        if(this.nodes[nodeId].endLetter == 'Z') {
          keepGoing = false
          this.stepCounts.push(stepCount)
        }

        nodeId = this.nodes[nodeId][move]

        stepCount++
      }
    })

    return this.findLCM(this.stepCounts)
  }

  // Inspired by https://stackoverflow.com/a/31302607
  // LCM: Least Common Multiple
  findLCM(numbers) {
    numbers.sort((a,b) => (a-b))

    let multiple = numbers.shift()

    numbers.forEach((number) => {
      let gcd  = this.findGCD(multiple, number)
      multiple = (multiple * number) / gcd
    })

    return multiple
  }

  // Inspired by https://stackoverflow.com/a/31302607
  // GCD: Greatest Common Denominator
  findGCD(a, b) {
    if (b == 0) {
      return a
    }
    else {
      return this.findGCD(b, a % b)
    }
  }

  prepareStepsAndNodes() {
    this.input = this.input.replace(/^\n/,     '')
                           .replace(/\n$/,     '')
                           .replace(/[\(\)]/g, '')

    let [ head, body ] = this.input.split('\n\n')

    this.steps = head.split('') // Head split, like Part 2 of Day 8!

    body.split('\n').forEach((line) => {
      let [ nodeId, nextNodes ] = line.split(' = ')

      let [ L, R ]  = nextNodes.split(', ')
      let endLetter = nodeId[2]

      this.nodes[nodeId] = { L, R, endLetter}
    })
  }

  findStartingNodes() {
    for (let nodeId in this.nodes) {
      if (this.nodes[nodeId].endLetter == 'A') {
        this.startingNodeIds.push(nodeId)
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
