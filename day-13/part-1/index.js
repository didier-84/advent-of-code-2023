import Pattern from './Pattern.js'
import values  from './../values.js'

const day  = 13
const part = 1

const {testInput, input} = values
const expectedTestResult = 405

class Task {
  constructor(input) {
    this.input  = input
    this.groups = []
  }

  run() {
    this.preparePatternGroups()

    return this.groups.reduce((acc, group) => {
      return acc += this.processPatternGroup(group)
    }, 0)
  }

  processPatternGroup(group) {
    let result = 0

    for (let key in group ) {
      result = group[key].computeReflection()
      if (result > 0) break
    }
    return result
  }

  preparePatternGroups() {
    let patterns = this.input.replace(/^\n/, '')
                             .replace(/\n$/, '')
                             .split('\n\n')

    this.groups = patterns.map((pattern) => {
      return {
        rows: new Pattern(pattern, { factor: 100, transpose: false }),
        cols: new Pattern(pattern, { factor: 1,   transpose: true  })
      }
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
