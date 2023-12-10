import values from './../values.js'

const day  = 5
const part = 1

const {testInput, input} = values
const expectedTestResult = 35

class Task {
  constructor(input) {
    this.input = input.replace(/\n$/, '')
    this.seeds = []
    this.maps  = []
  }

  run() {
    this.prepareSeedsAndMaps()

    let values = this.seeds

    for (let name in this.maps) {
      values = this.sourcesToDestinations(name, values)
    }
    return Math.min(...values)
  }

  prepareSeedsAndMaps() {
    let sections = this.input.split('\n\n')
    let seedLine = sections.shift()
    this.seeds   = seedLine.split(': ')[1].split(' ').map((seed) => parseInt(seed))
    this.generateMaps(sections)
  }

  generateMaps(sections) {
    sections.forEach((section) => {
      let lines = section.split('\n')
      let name  = lines.shift().replace(' map:', '')

      this.maps[name] = lines.map((line) => {
        let values = line.split(' ')

        return {
          'destinationStart': parseInt(values[0]),
          'sourceStart':      parseInt(values[1]),
          'sourceEnd':        parseInt(values[1]) + parseInt(values[2]),
          'length':           parseInt(values[2])
        }
      })
    })
  }

  sourcesToDestinations(name, sources) {
    let destinations = sources.map((source) => {
      let destination = source

      this.maps[name].forEach((map) => {
        if (destination != source) return
        if (source >= map['sourceStart'] && source < map['sourceEnd']) {
          let delta   = source - map['sourceStart']
          destination = map['destinationStart'] + delta
        }
      })
      return destination
    })

    return destinations
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
