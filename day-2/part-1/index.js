import values from './../values.js'

const day  = 2
const part = 1

const {testInput, input} = values
const expectedTestResult = 8

const MAX_RED   = 12
const MAX_GREEN = 13
const MAX_BLUE  = 14

class Task {
  constructor(input) {
    this.input = input
    this.sum   = 0
  }

  run() {
    let lines = this.input.split('\n')

    lines.forEach((line) => {
      if (line.length == 0) return
      let [ name, game ] = line.split(': ')
      if (this.isValidGame(game)) {
        this.sum += parseInt(name.substring(5))
      }
    })
    return this.sum
  }

  isValidGame(game) {
    let valid = true
    let sets  = game.split('; ')

    sets.forEach((set) => {
      if (valid && !this.isValidSet(set)) {
        valid = false
        return
      }
    })
    return valid
  }

  isValidSet(set) {
    let valid = true
    let subsets = set.split(', ')

    subsets.forEach((subset) => {
      if (valid && !this.isValidSubset(subset)) {
        valid = false
        return
      }
    })
    return valid
  }

  isValidSubset(subset) {
    let [number, color] = subset.split(' ')
    switch (color){
      case 'red':   return number <= MAX_RED
      case 'green': return number <= MAX_GREEN
      case 'blue':  return number <= MAX_BLUE
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
