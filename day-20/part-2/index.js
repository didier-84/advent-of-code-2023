import ModuleBuilder  from './ModuleBuilder.js'
import values from './../values.js'

const day  = 20
const part = 2

const {input} = values

class Task {
  constructor(input) {
    this.input  = input
    this.modules = {}

    this.criticalModules = {}

    this.counts = { low: 0, high: 0 }
    this.total  = 0

    this.prepareModules()
  }

  run() {
    let next = 0
    let nextPulses = []

    for (let i = 0; i < 10000; i++) {
      next = { name: 'broadcaster', intensity: 'low' }

      while (next && !this.allCriticalModulesFound()) {
        if (this.criticalModules[next.source] != undefined ) {
          if (next.intensity == 'high') {
            if (this.criticalModules[next.source] == 0) {
              this.criticalModules[next.source] = i + 1
            }
          }
        }

        if (this.modules[next.name] !== undefined) {
          nextPulses = nextPulses.concat(this.modules[next.name].receive(next))
        }

        next = nextPulses.shift()
      }

      if (this.allCriticalModulesFound()) {
        this.total = this.findLCM(Object.values(this.criticalModules))
        break
      }
    }

    return this.total
  }

  allCriticalModulesFound() {
    let result = true
    for (let name in this.criticalModules) {
      if (this.criticalModules[name] == 0) {
        result = false
      }
    }
    return result
  }

  findLCM(numbers) {
    numbers.sort((a,b) => (a-b))

    let multiple = numbers.shift()

    numbers.forEach((number) => {
      let gcd  = this.findGCD(multiple, number)
      multiple = (multiple * number) / gcd
    })

    return multiple
  }

  findGCD(a, b) {
    if (b == 0) {
      return a
    }
    else {
      return this.findGCD(b, a % b)
    }
  }

  prepareModules() {
    let lines = this.input.replace(/^\n/, '')
                          .replace(/\n$/, '')
                          .split('\n')

    let conjunctions   = []
    let moduleBeforeRx = ''

    lines.forEach((line) => {
      let mod = ModuleBuilder.from(line)

      if (mod.type == 'conjunction') {
        conjunctions.push(mod.name)
      }

      if (mod.destinations.includes('rx')) {
        moduleBeforeRx = mod.name
      }

      this.modules[mod.name] = mod
    })

    this.setConjuctionsInputs(conjunctions)
    this.identifyModulesLeadingtoRx(moduleBeforeRx)
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

  identifyModulesLeadingtoRx(moduleBeforeRx) {
    for (let name in this.modules) {
      let destinations = this.modules[name].destinations
      if (destinations.includes(moduleBeforeRx)) {
        this.criticalModules[name] = 0
      }
    }
  }
}

console.log(`# Day ${day} - Part ${part} #`)
console.log('----------------')

const realResult = new Task(input).run()

console.log(' Real task:')
console.log(' - Computed result: ' + realResult)
