import testFunctions from './test.js'
import values        from './../values.js'

const day  = 18
const part = 2

const {testInput, input} = values
const expectedTestResult = 952408144115

const {testAlgoOnSimpleSquare, testAlgoOnSimpleCross} = testFunctions

testAlgoOnSimpleSquare()
testAlgoOnSimpleCross()

let point = (x, y) => ({ x, y })

class Task {
  constructor(input) {
    this.input        = input
    this.instructions = []
    this.points       = []

    this.trenchPerimeter = 0
    this.insideArea      = 0
    this.total           = 0

    this.prepareInstructions()
    this.preparePoints()
  }

  run() {
    this.computeInsideArea()

    this.total += Math.abs(this.insideArea)
    this.total += this.trenchPerimeter
    this.total /= 2
    this.total += 1 // For some reason, the total is off by 1

    return this.total
  }

  computeInsideArea() {
    for (let i = 0; i < this.points.length - 1; i++) {
      let p1 = this.points[i]
      let p2 = this.points[i + 1]

      this.insideArea += (p1.x * p2.y) - (p2.x * p1.y)
    }
  }

  prepareInstructions() {
    let rows = this.input.replace(/^\n/, '')
                         .replace(/\n$/, '')
                         .split('\n')

    this.instructions = rows.map((row) => {
      let hexValue  = row.split('(#')[1].replace(')', '')
      let count     = parseInt(hexValue.slice(0,5), 16)
      let direction = hexValue.slice(5)

      return {direction, count}
    })
  }

  preparePoints() {
    let x = 0
    let y = 0

    this.points.push({x, y})

    this.instructions.forEach((instruction) => {
      let {direction, count} = instruction

      this.trenchPerimeter += count

      switch (direction) {
        case '0': x += count; break
        case '1': y += count; break
        case '2': x -= count; break
        case '3': y -= count; break
      }

      this.points.push(point(x, y))
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
