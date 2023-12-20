import ModuleBuilder  from './ModuleBuilder.js'
import values from './../values.js'

const day  = 20
const part = 1

const {testInputOne, testInputTwo, input} = values
const expectedTestResults = [ 32000000, 11687500 ]

class Task {
  constructor(input) {
    this.input  = input
    this.modules = {}

    this.counts = { low: 0, high: 0 }
    this.total  = 0

    this.prepareModules()
  }

  run() {
    let next = 0
    let nextPulses = []

    for (let i = 0; i < 1000; i++) {
      next = { name: 'broadcaster', intensity: 'low' }

      while (next) {
        this.counts[next.intensity]++

        if (this.modules[next.name] !== undefined) {
          nextPulses = nextPulses.concat(this.modules[next.name].receive(next))
        }

        next = nextPulses.shift()
      }
    }

    this.total = this.counts.high * this.counts.low
    return this.total
  }

  prepareModules() {
    let lines = this.input.replace(/^\n/, '')
                          .replace(/\n$/, '')
                          .split('\n')

    let conjunctions = []

    lines.forEach((line) => {
      let mod = ModuleBuilder.from(line)

      if (mod.type == 'conjunction') {
        conjunctions.push(mod.name)
      }

      this.modules[mod.name] = mod
    })

    this.setConjuctionsInputs(conjunctions)
  }

  setConjuctionsInputs(conjunctions) {
    for (let name in this.modules) {
      let destinations = this.modules[name].destinations
      destinations.forEach((destination) => {
        if (conjunctions.indexOf(destination) != -1) {
          this.modules[destination].inputs[name] = 'low'
        }
      })
    }
  }
}

console.log(`# Day ${day} - Part ${part} #`)
console.log('----------------')

const testResults = [
  new Task(testInputOne).run(),
  new Task(testInputTwo).run(),
]

console.log(' Test 1:')
console.log(' - Expected result: ' + expectedTestResults[0])
console.log(' - Computed result: ' + testResults[0])

console.log('----------------')

console.log(' Test 2:')
console.log(' - Expected result: ' + expectedTestResults[1])
console.log(' - Computed result: ' + testResults[1])

console.log('----------------')

const realResult = new Task(input).run()

console.log(' Real task:')
console.log(' - Computed result: ' + realResult)
