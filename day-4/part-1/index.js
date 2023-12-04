import values from './../values.js'

const day  = 4
const part = 1

const {testInput, input} = values
const expectedTestResult = 13

class Task {
  constructor(input) {
    this.input = input.replace('  ', ' ')
  }

  run() {
    this.cards = this.input.split('\n').slice(1, -1)
    return this.cards.reduce((acc, card) => acc + this.computeCardWorth(card), 0)
  }

  computeCardWorth(card) {
    const [winningSet, mySet] = card.split(':')[1].trim().split('|')

    const winningNumbers = this.splitSetToNumbers(winningSet)
    const myNumbers      = this.splitSetToNumbers(mySet)

    return myNumbers.reduce((acc, number) => {
      if (winningNumbers.indexOf(number) == -1) {
        return acc
      } else {
        return (acc == 0) ? 1 : (acc * 2)
      }
    }, 0)
  }

  splitSetToNumbers(set) {
    return set.split(' ').filter((number) => number != '')
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
