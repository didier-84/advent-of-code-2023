import values from './../values.js'

const day  = 4
const part = 2

const {testInput, input} = values
const expectedTestResult = 30

class Task {
  constructor(input) {
    this.input = input.replace('  ', ' ')
    this.extraCards = []
    this.sum = 0
  }

  run() {
    this.cards = this.input.split('\n').slice(0, -1)

    this.cards.forEach((card, index) => {
      if (index == 0) return;

      let factor = 1

      if (this.extraCards[index] != undefined ) {
        factor += this.extraCards[index]
      }

      this.sum += factor

      let cardId    = this.extractCardId(card)
      let cardWorth = this.computeCardWorth(card)

      if (cardWorth > 0) {
        let next = index + 1
        let last = index + cardWorth

        for (let i = next; i <= last; i++) {
          if (this.extraCards[i] == undefined) {
            this.extraCards[i] = factor
          } else {
            this.extraCards[i] = this.extraCards[i] + factor
          }
        }
      }
    })

    return this.sum
  }

  extractCardId(card) {
    return parseInt(card.split(':')[0].substring(5))
  }

  computeCardWorth(card) {
    const [winningSet, mySet] = card.split(':')[1].trim().split('|')

    const winningNumbers = this.splitSetToNumbers(winningSet)
    const myNumbers      = this.splitSetToNumbers(mySet)

    return myNumbers.reduce((acc, number) => {
      if (winningNumbers.indexOf(number) == -1) {
        return acc
      } else {
        return acc + 1
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
