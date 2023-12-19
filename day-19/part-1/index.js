import Workflow from './Workflow.js'
import values   from './../values.js'

const day  = 19
const part = 1

const {testInput, input} = values
const expectedTestResult = 19114

class Task {
  constructor(input) {
    this.input     = input
    this.workflows = {}
    this.parts     = []

    this.total = 0

    this.prepareWorkflowsAndParts()
  }

  run() {
    this.parts.forEach((part) => {
      let keepGoing = true
      let name      = 'in'

      while (keepGoing) {
        name = this.workflows[name].process(part)

        if (name === true) {
          keepGoing   = false
          this.total += part.total
        } else if (name === false) {
          keepGoing = false
        }
      }
    })
    return this.total
  }

  prepareWorkflowsAndParts() {
    this.input = this.input.replace(/^\n/, '')
                           .replace(/\n$/, '')
                           .split('\n\n')

    let workflowLines = this.input[0].split('\n')
    let partLines     = this.input[1].split('\n')

    workflowLines.forEach((line) => {
      let workflow = new Workflow(line)
      this.workflows[workflow.name] = workflow
    })

    partLines.forEach((line) => {
      let part  = {}
      let total = 0
      let cats  = line.replace('{', '')
                      .replace('}', '')
                      .split(',')

      cats.forEach((cat) => {
        let [key, value] = cat.split('=')

        value      = parseInt(value)
        part[key]  = value
        total     += value
      })

      part.total = total
      this.parts.push(part)
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
