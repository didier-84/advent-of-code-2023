import values from './../values.js'

const day  = 7
const part = 2

const {testInput, input} = values
const expectedTestResult = 5905

// Names for debug/readability
const HANDTYPES = [
  'Five of a kind',
  'Four of a kind',
  'Full house',
  'Three of a kind',
  'Two pairs',
  'One pair',
  'High card'
]

class Task {
  constructor(input) {
    this.input = input
    this.total = 0

    this.handsCount  = 0
    this.handsByType = []

    HANDTYPES.forEach((type) => {
      this.handsByType[type] = []
    })

    this.prepareHands()
  }

  run() {
    // Rank hands in each type
    for (let type in this.handsByType) {
      this.handsByType[type].sort((a, b) => {
        return (a.code < b.code) ? -1 : 1
      })

      // Compute total for each hand
      this.handsByType[type].forEach((hand) => {
        this.total += hand.bid * this.handsCount
        this.handsCount--
      })
    }
    return this.total
  }

  prepareHands() {
    let lines = this.input.split('\n').slice(1, -1)

    lines.forEach((line) => {
      let hand = this.prepareHand(line)
      this.handsByType[hand.type].push(hand)
    })

    this.handsCount = lines.length
  }

  prepareHand(line) {
    let [cards, bid] = line.split(' ')

    let code = this.computeAlphaCode(cards)
    let type = this.computeHandType(code)

    return {bid, cards, code, type}
  }

  // Using a letters-only code to easily sort hands
  computeAlphaCode(cards) {
    let map = this.cardCodeMap()

    // Set lowest letter for Jack/Joker
    map.J = 'z'

    let code = cards.split('').map((card) => map[card])

    return code.join('')
  }

  computeHandType(code) {
    let handStrengh = ''
    let occurences  = this.newOccurenceMap()

    code.split('').forEach((letter) => {
      occurences[letter]++
    })

    let sortedCounts = Object.values(occurences).sort((a, b) => (b - a))

    sortedCounts.forEach((count) => {
      handStrengh += (count > 0) ? count : ''
    })

    // Jokers count
    let offset = occurences['z'] || 0

    if (offset > 0) {
      if (handStrengh == '41')   offset = 1 // can only upgrade to '5'
      if (handStrengh == '32')   offset = 2 // can only upgrade to '5'
      if (handStrengh == '311')  offset = 2 // can only upgrade to '41'
      if (handStrengh == '221')  offset++   // can upgrade to '32' or '41'
      if (handStrengh == '2111') offset = 2 // can only upgrade to '311'
    }

    switch(handStrengh) {
      case '5':     return HANDTYPES[0]
      case '41':    return HANDTYPES[1 - offset]
      case '32':    return HANDTYPES[2 - offset]
      case '311':   return HANDTYPES[3 - offset]
      case '221':   return HANDTYPES[4 - offset]
      case '2111':  return HANDTYPES[5 - offset]
      case '11111': return HANDTYPES[6 - offset]
    }
  }

  cardCodeMap() {
    return {
      'A': 'a', 'K': 'b', 'Q': 'c', 'J': 'd', 'T': 'e',
      '9': 'f', '8': 'g', '7': 'h', '6': 'i', '5': 'j',
      '4': 'k', '3': 'l', '2': 'm'
    }
  }

  newOccurenceMap() {
    return {
      'a': 0, 'b': 0, 'c': 0, 'd': 0, 'e': 0,
      'f': 0, 'g': 0, 'h': 0, 'i': 0, 'j': 0,
      'k': 0, 'l': 0, 'm': 0, 'z': 0
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
