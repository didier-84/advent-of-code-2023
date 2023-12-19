import Workflow from './Workflow.js'
import values   from './../values.js'

const day  = 19
const part = 2

const {testInput, input} = values
const expectedTestResult = 167409079868000

class Task {
  constructor(input) {
    this.input     = input
    this.workflows = {}

    this.startName  = 'in'
    this.startRange = {
      x: { start: 1, end: 4000 },
      m: { start: 1, end: 4000 },
      a: { start: 1, end: 4000 },
      s: { start: 1, end: 4000 }
    }

    this.total = 0

    this.prepareWorkflows()
  }

  run() {
    let resultingRanges    = []
    let rangesToProcess = [{
      name:  this.startName,
      range: this.startRange
    }]

    let current = rangesToProcess.shift()

    while (current) {
      resultingRanges = this.workflows[current.name].processRange(current.range)

      resultingRanges.accepted.forEach((range) => {
        let product = 1
        for (let cat in range) {
          product *= (range[cat].end - range[cat].start + 1)
        }
        this.total += product
      })

      rangesToProcess = rangesToProcess.concat(resultingRanges.redirect)
      current = rangesToProcess.shift()
    }

    return this.total
  }

  prepareWorkflows() {
    this.input = this.input.replace(/^\n/, '')
                           .replace(/\n$/, '')
                           .split('\n\n')

    let workflowLines = this.input[0].split('\n')

    workflowLines.forEach((line) => {
      let workflow = new Workflow(line)
      this.workflows[workflow.name] = workflow
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
