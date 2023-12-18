import values from './../values.js'

const day  = 17
const part = 1

const {testInput, input} = values
const expectedTestResult = 102

class Task {
  constructor(input) {
    this.input = input
    this.blocks = {}

    this.endKey = ''

    this.stack = []
    this.visited   = {}
    this.bestTotal = Number.MAX_SAFE_INTEGER

    this.prepareBlocks()
  }

  run() {
    this.addNextBlocks('0-0', 'E', 1, 0)

    while(this.stack.length > 0) {
      let nextStep = this.stack.pop()
      this.process(nextStep)
    }

    return this.bestTotal
  }

  process(step) {
    let { key, direction, distance, heatLoss } = step

    let block = this.blocks[key]
    heatLoss  = heatLoss + block.heat

    if (heatLoss > this.bestTotal) return

    if (key == this.endKey) {
      this.bestTotal = heatLoss
      return
    }

    this.addNextBlocks(key, direction, distance, heatLoss)
  }

  addNextBlocks(key, direction, distance, heatLoss) {
    let block = this.blocks[key]
    let steps = []

    let nextDirections = ('NS'.includes(direction)) ? ['W', 'E'] : ['N', 'S']
    if (distance < 3) nextDirections.push(direction)

    nextDirections.forEach((nextDirection) => {
      let prevHeatLoss = undefined
      let nextKey  = ''
      let nextDistance = (nextDirection == direction) ? (distance + 1) : 1

      switch (nextDirection) {
        case 'N': nextKey = `${block.row - 1}-${block.col}`; break
        case 'S': nextKey = `${block.row + 1}-${block.col}`; break
        case 'W': nextKey = `${block.row}-${block.col - 1}`; break
        case 'E': nextKey = `${block.row}-${block.col + 1}`; break
      }

      if (this.blocks[nextKey] != undefined ) {
        prevHeatLoss = this.getHeatLossOfalreadyVisited(nextKey, nextDirection, nextDistance)

        if (prevHeatLoss == undefined || prevHeatLoss > heatLoss) {
          this.markAsVisited(nextKey, nextDirection, nextDistance, heatLoss)
          this.addToNextSteps(nextKey, nextDirection, nextDistance, heatLoss)
        }
      }
    })
  }

  oppositeDirection(direction) {
    const directions = {N: 'S', E: 'W', S: 'N', W:'E'}
    return directions[direction]
  }

  getHeatLossOfalreadyVisited(blockKey, direction, distance) {
    let key = [blockKey, direction, distance].join('|')
    return this.visited[key]
  }

  markAsVisited(blockKey, direction, distance, heatLoss) {
    let key = [blockKey, direction, distance].join('|')
    this.visited[key] = heatLoss
  }

  addToNextSteps(key, direction, distance, heatLoss) {
    this.stack.push({ key, direction, distance, heatLoss })
  }

  prepareBlocks() {
    let rows = this.input.replace(/^\n/, '')
                         .replace(/\n$/, '')
                         .replace(/\\/g, '╲')
                         .replace(/\//g, '╱')
                         .split('\n')

    this.endKey = `${rows.length - 1}-${rows[0].length - 1}`

    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < rows[0].length; j++) {
        let key = `${i}-${j}`
        this.blocks[key] = {
          heat: parseInt(rows[i][j]),
          row:  i,
          col:  j
        }
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
