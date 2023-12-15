import values from './../values.js'

const day  = 15
const part = 2

const {testInput, input} = values
const expectedTestResult = 145

class Task {
  constructor(input) {
    this.input   = input
    this.strings = []
    this.boxes   = {}

    this.total   = 0

    this.prepareLenses()
  }

  run() {
    this.lenses.forEach((lense) => {
      if (lense.action == 'add') {
        this.addLenseToBox(lense)
      } else {
        this.removeLenseFromBox(lense)
      }
    })

    for (let boxId in this.boxes) {
      if (this.boxes[boxId].length != 0) {
        this.boxes[boxId].forEach((lense, index) => {
          this.total += (lense.boxId + 1) * (index + 1) * lense.id
        })
      }
    }

    return this.total
  }

  addLenseToBox(newLense) {
    let boxId = this.findBoxIdFromLenseLabel(newLense.label)
    this.maybeCreateBox(boxId)

    newLense.boxId = parseInt(boxId)
    let wasReplaced  = false

    this.boxes[boxId].forEach((lense, index) => {
      if (lense.label == newLense.label) {
        this.boxes[boxId][index] = newLense
        wasReplaced = true
      }
    })

    if (!wasReplaced) {
      this.boxes[boxId].push(newLense)
    }
  }

  maybeCreateBox(boxId) {
    if (this.boxes[boxId] == undefined) {
      this.boxes[boxId] = []
    }
  }

  removeLenseFromBox(newLense) {
    let boxId = this.findBoxIdFromLenseLabel(newLense.label)

    if (this.boxes[boxId] != undefined) {
      this.boxes[boxId] = this.boxes[boxId].filter((lense) => {
        return (lense.label != newLense.label)
      })
    }
  }

  findBoxIdFromLenseLabel(label) {
    let currentValue = 0

    label.split('').forEach((char) => {
      currentValue += char.charCodeAt(0)
      currentValue *= 17
      currentValue = currentValue % 256
    })
    return currentValue
  }

  prepareLenses() {
    let strings = this.input.replace(/^\n/, '')
                             .replace(/\n$/, '')
                             .split(',')

    this.lenses = strings.map((string) => {
      let action = 'add'
      let parts  = string.split(/[\=\-]/)
      let label  = parts[0]
      let id     = parseInt(parts[1])

      if (string.includes('-')) action = 'remove'

      return { action, label, id }
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
