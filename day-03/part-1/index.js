import values from './../values.js'

const day  = 3
const part = 1

const {testInput, input} = values
const expectedTestResult = 4361

class Task {
  constructor(input) {
    let regex  = new RegExp(/[^\d\.\n]{1}/, 'gm')

    this.input = input.replace(regex,'*')
    this.lines = this.input.split('\n')

    this.sum   = 0;
  }

  run() {
    this.lines.forEach((line, index) => {
      let match = 0
      let regex = new RegExp(/\d+/, 'g')
      while ((match = regex.exec(line)) != null) {
        let start = match.index
        let end   = start + match.toString().length
        if (this.hasAdjacentStar(index, start, end)) {
          this.sum += parseInt(match)
        }
      }
    })

    return this.sum
  }

  hasAdjacentStar(lineIndex, start, end) {
    // Horizontally, before and after
    if (this.isStar(lineIndex, start - 1)) return true
    if (this.isStar(lineIndex, end))       return true

    // Vertically, before, after
    for (let i = start; i <= end; i++) {
      if (this.isStar(lineIndex - 1, i)) return true
      if (this.isStar(lineIndex + 1, i)) return true
    }

    // Diagonally, top-left, top-right, bottom-left, bottom-right
    if (this.isStar(lineIndex - 1, start - 1)) return true
    if (this.isStar(lineIndex - 1, end))       return true
    if (this.isStar(lineIndex + 1, start - 1)) return true
    if (this.isStar(lineIndex + 1, end))       return true
  }

  isStar(lineIndex, charIndex) {
    if (lineIndex == -1 )               return false
    if (lineIndex == this.lines.length) return false
    if (charIndex == -1)                return false
    return (this.lines[lineIndex][charIndex] != undefined)
        && (this.lines[lineIndex][charIndex] == '*')
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
