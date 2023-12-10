import values from './../values.js'

const day  = 3
const part = 2

const {testInput, input} = values
const expectedTestResult = 467835

class Task {
  constructor(input) {
    let regex  = new RegExp(/[^\d\.\n]{1}/, 'gm')

    this.input = input.replace(regex,'*')
    this.lines = this.input.split('\n')

    this.parts = {}
    this.sum   = 0
  }

  run() {
    this.lines.forEach((line, index) => {
      let match = 0
      let regex = new RegExp(/\d+/, 'g')
      while ((match = regex.exec(line)) != null) {
        let starPos = this.adjacentStarPosition(index, match.index, match.index + match.toString().length)
        let number  = parseInt(match.toString())
        if (starPos != false) this.addToParts(`${starPos[0]}-${starPos[1]}`, number)
      }
    })

    this.computeGearRatioSum()
    return this.sum
  }

  adjacentStarPosition(lineIndex, start, end) {
    // Horizontally, before and after
    if (this.isStar(lineIndex, start - 1)) return [lineIndex, start -1]
    if (this.isStar(lineIndex, end))       return [lineIndex, end]

    // Vertically: before, after
    for (let i = start; i <= end; i++) {
      if (this.isStar(lineIndex - 1, i)) return [lineIndex - 1, i]
      if (this.isStar(lineIndex + 1, i)) return [lineIndex + 1, i]
    }

    // Diagonally, top-left, top-right, bottom-left, bottom-right
    if (this.isStar(lineIndex - 1, start - 1)) return [lineIndex - 1, start - 1]
    if (this.isStar(lineIndex - 1, end))       return [lineIndex - 1, end]
    if (this.isStar(lineIndex + 1, start - 1)) return [lineIndex + 1, start - 1]
    if (this.isStar(lineIndex + 1, end))       return [lineIndex + 1, end]

    return false
  }

  isStar(lineIndex, charIndex) {
    if (lineIndex == -1 )               return false
    if (lineIndex == this.lines.length) return false
    if (charIndex == -1)                return false

    return (this.lines[lineIndex][charIndex] != undefined)
        && (this.lines[lineIndex][charIndex] == '*')
  }

  addToParts(index, value) {
    if (this.parts[index] == undefined ) {
      this.parts[index] = [value]
    } else {
      this.parts[index].push(value)
    }
  }

  computeGearRatioSum() {
    for (const [key, group] of Object.entries(this.parts)) {
      if (group.length > 1) {
        this.sum += group.reduce((acc, value) => (acc * value), 1)
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
