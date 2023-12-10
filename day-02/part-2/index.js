import values from './../values.js'

const day  = 2
const part = 2

const {testInput, input} = values
const expectedTestResult = 2286

class Task {
  constructor(input) {
    this.input = input

    this.red   = 0
    this.green = 0
    this.blue  = 0

    this.power = 0
  }

  run() {
    let lines = this.input.split('\n')

    lines.forEach((line) => {
      if (line.length == 0) return
      let [ name, game ] = line.split(': ')

      this.power += this.gamePower(game)
    })
    return this.power
  }

  gamePower(game) {
    this.red   = 0
    this.green = 0
    this.blue  = 0

    let sets  = game.split('; ')
    sets.forEach((set) => {
      this.setPower(set)
    })
    return this.red * this.green * this.blue
  }

  setPower(set) {
    let subsets = set.split(', ')

    subsets.forEach((subset) => {
      let [number, color] = subset.split(' ')

      switch (color) {
        case 'red':
          this.red = Math.max(this.red, parseInt(number))
          break
        case 'green':
          this.green = Math.max(this.green, parseInt(number))
          break
        case 'blue':
          this.blue = Math.max(this.blue, parseInt(number))
          break
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
