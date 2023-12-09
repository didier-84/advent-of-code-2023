import values from './../values.js'

const day  = 5
const part = 2

const {testInput, input} = values
const expectedTestResult = 46

class Task {
  constructor(input) {
    this.input = input.replace(/\n$/, '')
    this.maps  = []

    this.seedRanges = []

    this.lowestLocation = Number.MAX_SAFE_INTEGER
  }

  run() {
    this.prepareSeedsAndMaps()

    this.seedRanges.forEach((range) => {
      this.processRangeAtLevel(range, 0)
    })

    return this.lowestLocation
  }

  processRangeAtLevel(range, level) {
    const nextLevel    = level + 1
    let keepConverting = (this.maps[nextLevel] != undefined )

    this.maps[level]['maps'].forEach((map) => {
      let convertedRange = this.convertRangeWithMap(range, map)

      if (!convertedRange) return

      if (keepConverting) {
        this.processRangeAtLevel(convertedRange, nextLevel)
      } else {
        this.lowestLocation = Math.min(convertedRange.start, this.lowestLocation)
      }
    })
  }

  convertRangeWithMap(range, map) {
    // TOTALLY BEFORE or TOTALLY AFTER
    if ((map.end < range.start) || (map.start > range.end)) {
      return false
    }

    // MAP STARTS BEFORE/ON RANGE STARTS
    if (map.start <= range.start) {
      // MAP ENDS ON/AFTER RANGE ENDS
      if (map.end >= range.end ) {
        return {
          start: range.start + map.offset,
          end:   range.end   + map.offset
        }
      }
      // MAP ENDS BEFORE RANGE ENDS
      else {
        return {
          start: range.start + map.offset,
          end:   map.end     + map.offset
        }
      }
    }
    // MAP START AFTER RANGE START
    else {
      // MAP ENDS BEFORE RANGE ENDS
      if (map.end < range.end ) {
        return {
          start: map.start + map.offset,
          end:   map.end   + map.offset
        }
      }
      // MAP ENDS ON/AFTER RANGE ENDS
      else {
        return {
          start: map.start + map.offset,
          end:   range.end + map.offset
        }
      }
    }
  }

  prepareSeedsAndMaps() {
    let sections = this.input.split('\n\n')
    let seedLine = sections.shift()
    let seeds    = seedLine.split(': ')[1]
                           .split(' ')
                           .map((seed) => parseInt(seed))

    for (let i = 0; i < seeds.length; i += 2) {
      this.seedRanges.push({
        'start': seeds[i],
        'end':   seeds[i] + seeds[i+1] - 1
      })
    }

    this.generateMaps(sections)
  }

  generateMaps(sections) {
    this.maps = sections.map((section) => {
      let lines = section.split('\n')

      // For debug purpose only
      let name  = lines.shift().replace(' map:', '')

      let maps = lines.map((line) => {
        let values = line.split(' ')

        let dStart = parseInt(values[0]) // Destination start
        let start  = parseInt(values[1]) // Source start
        let length = parseInt(values[2]) // Map length
        let end    = start + length - 1  // Source end
        let offset = dStart - start      // Offset from destination to source

        return { start, end, offset }
      })

      maps = maps.concat(this.findInterstices(maps))
      maps.sort((a,b) => a.start - b.start )

      return { name, maps }
    })
  }

  findInterstices(maps) {
    let interstices = []

    let maxValue = Number.MAX_SAFE_INTEGER
    let position = 0 - maxValue

    maps.sort((a,b) => a.start - b.start )

    maps.forEach((map) => {
      if (map.start > position + 1 ) {

        interstices.push({
          'start':  position,
          'end':    map.start - 1,
          'offset': 0
        })
      }
      position = map.end
    })

    interstices.push({
      'start':  position + 1,
      'end':    maxValue,
      'offset': 0
    })

    return interstices
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
