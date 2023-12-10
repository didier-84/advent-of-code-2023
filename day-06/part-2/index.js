import values from './../values.js'

const day  = 6
const part = 2

const {testInput, input} = values
const expectedTestResult = 71503

class Task {
  constructor(input) {
    this.input = input.replace('  ', ' ')
    this.races = []

    this.convertInputToRaces()
  }

  run() {
    let result = this.races.reduce((acc, race) => {
      let recordBreakingAttempts = 0

      let totalDuration = race.duration
      let bestDistance  = race.distance

      for (let ms = 0; ms < totalDuration; ms++) {
        let boatSpeed = ms
        let raceTime  = totalDuration - ms

        if (boatSpeed * raceTime > bestDistance) {
          recordBreakingAttempts++
        }
      }
      return acc * recordBreakingAttempts
    }, 1)

    return result
  }

  convertInputToRaces() {
    let durations = []
    let distances = []

    let lines = this.input.split('\n').slice(1, -1)

    lines = lines.map((line) => {
      return line.replace('Time: ', '')
                 .replace('Distance: ', '')
                 .replace(/\s/g, '')
                 .trim()
    })

    durations = lines[0].split(' ')
    distances = lines[1].split(' ')

    durations.forEach((duration, index) => {
      this.races.push({
        duration: duration,
        distance: distances[index]
      })
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
