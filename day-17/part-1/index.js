import Block  from './Block.js'
import values from './../values.js'

const day  = 17
const part = 1

const {testInput, input} = values
const expectedTestResult = 102

class Task {
  constructor(input) {
    this.input = input
    this.blocks = {}

    this.stack = {
      0:[], 1:[], 2:[], 3:[], 4:[],
      5:[], 6:[], 7:[], 8:[], 9:[]
    }
    this.visited   = {}
    this.bestTotal = Number.MAX_SAFE_INTEGER

    this.prepareBlocks()
  }

  run() {
    this.addNextBlocks('0-0', 'E', 1, 0)

    let nextStep = this.getNextStepFromStack()

    while (nextStep != undefined) {
      this.process(nextStep)
      nextStep = this.getNextStepFromStack()
    }

    return this.bestTotal
  }

  getNextStepFromStack() {
    for (let heat in this.stack) {
      if (this.stack[heat].length == 0) continue
      let nextStep = this.stack[heat].pop()
      return nextStep
    }
  }

  process(step) {
    let { key, direction, distance, heatLoss } = step
    let block = this.blocks[key]

    heatLoss = heatLoss + block.heat

    if (heatLoss > this.bestTotal) return

    if (block.isTheEnd) {
      this.bestTotal = heatLoss
      return
    }

    this.addNextBlocks(key, direction, distance, heatLoss)
  }

  addNextBlocks(key, direction, distance, heatLoss) {
    let block = this.blocks[key]

    let nextDirections = []

    let isNS = (direction == 'N' || direction == 'S')
    if (isNS) {
      nextDirections.push('W')
      nextDirections.push('E')
    } else {
      nextDirections.push('N')
      nextDirections.push('S')
    }

    if (distance < 3) nextDirections.push(direction)

    nextDirections.forEach((nextDirection) => {
      let prevHeatLoss = undefined
      let nextDistance = (nextDirection == direction) ? (distance + 1) : 1

      let nextKey = block.nextKeyTo(nextDirection)

      if (this.blocks[nextKey] != undefined ) {
        prevHeatLoss = this.getHeatLossOfalreadyVisited(nextKey, nextDirection, nextDistance)

        if (prevHeatLoss == undefined || prevHeatLoss > heatLoss) {
          this.markAsVisited(nextKey, nextDirection, nextDistance, heatLoss)
          this.addToNextSteps(nextKey, nextDirection, nextDistance, heatLoss, block.heat)
        }
      }
    })
  }

  getHeatLossOfalreadyVisited(blockKey, direction, distance) {
    if (this.visited[blockKey] == undefined)            return undefined
    if (this.visited[blockKey][direction] == undefined) return undefined

    return this.visited[blockKey][direction][distance]
  }

  markAsVisited(blockKey, direction, distance, heatLoss) {
    if (this.visited[blockKey] == undefined) {
      this.visited[blockKey] = {}
    }

    if (this.visited[blockKey][direction] == undefined) {
      this.visited[blockKey][direction] = {}
    }

    this.visited[blockKey][direction][distance] = heatLoss
  }

  addToNextSteps(key, direction, distance, heatLoss, heat) {
    this.stack[heat].push({ key, direction, distance, heatLoss })
  }

  prepareBlocks() {
    let rows = this.input.replace(/^\n/, '')
                         .replace(/\n$/, '')
                         .replace(/\\/g, '╲')
                         .replace(/\//g, '╱')
                         .split('\n')

    let maxRow = rows.length    - 1
    let maxCol = rows[0].length - 1

    for (let row = 0; row <= maxRow; row++) {
      for (let col = 0; col <= maxCol; col++) {
        let block = new Block(row, col, rows[row][col], maxRow, maxCol)
        this.blocks[block.key] = block
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
