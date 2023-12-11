export default class Tile {
  constructor(pipe, rowIndex, colIndex, factor = 1) {
    this.pipe     = pipe
    this.factor   = factor
    this.rowIndex = rowIndex * factor
    this.colIndex = colIndex * factor
    this.key      = Tile.tileKeyFor(this.rowIndex, this.colIndex)
    this.isPath   = false
    this.isOut    = false
  }

  nextTileKey(direction, factor = 0) {
    if (factor == 0) factor = this.factor

    switch(direction) {
      case 'N':
        return Tile.tileKeyFor(this.rowIndex - factor, this.colIndex)
      case 'S':
        return Tile.tileKeyFor(this.rowIndex + factor, this.colIndex)
      case 'E':
        return Tile.tileKeyFor(this.rowIndex, this.colIndex + factor)
      case 'W':
        return Tile.tileKeyFor(this.rowIndex, this.colIndex - factor)
      }
  }

  isStart() {
    return (this.pipe == 'S')
  }

  isGround() {
    return (this.pipe == '.' || this.pipe == ' ')
  }

  allDirections() {
    return Tile.pipeDirectionsMap(this.pipe)
  }

  isInvalidOrigin(direction){
    let opposite   = this.oppositeDirection(direction)
    let directions = this.allDirections()
    return (directions.indexOf(opposite) == -1)
  }

  nextDirection(previous) {
    let [a, b]   = Tile.pipeDirectionsMap(this.pipe)
    let opposite = this.oppositeDirection(previous)

    return (opposite == a) ? b : a
  }

  oppositeDirection(direction) {
    let map = {'N': 'S', 'S': 'N', 'E': 'W', 'W': 'E'}
    return map[direction]
  }

  canGoNorth() {
    return (this.pipe == '|' || this.pipe == 'L' || this.pipe == 'J')
  }

  canGoSouth() {
    return (this.pipe == '|' || this.pipe == 'F' || this.pipe == '7')
  }

  canGoEast() {
    return (this.pipe == '-' || this.pipe == 'L' || this.pipe == 'F')
  }

  canGoWest() {
    return (this.pipe == '-' || this.pipe == '7' || this.pipe == 'J')
  }

  // Static Methods

  static tileKeyFor(rowIndex, colIndex) {
    return `${rowIndex}-${colIndex}`
  }

  static pipeDirectionsMap(pipe = '') {
    const map = {
      '|':  ['N', 'S'],
      '-':  ['E', 'W'],
      'L':  ['N', 'E'],
      'J':  ['N', 'W'],
      '7':  ['S', 'W'],
      'F':  ['S', 'E']
    }

    return (pipe == '') ? map : map[pipe]
  }
}
