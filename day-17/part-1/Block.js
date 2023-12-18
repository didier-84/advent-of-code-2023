export default class Block {
  constructor(row, col, heat, maxRow, maxCol) {
    this.row  = row
    this.col  = col
    this.key  = `${row}-${col}`
    this.heat = parseInt(heat)

    this.maxRow = maxRow
    this.maxCol = maxCol

    this.isTheEnd = (row == maxRow) && (col == maxCol)

    this.adjacentBlocks = {}
    this.computeAdjacentBlocks()
  }

  nextKeyTo(direction) {
    return this.adjacentBlocks[direction]
  }

  computeAdjacentBlocks(){
    this.adjacentBlocks = {
      'N': `${this.row - 1}-${this.col}`,
      'S': `${this.row + 1}-${this.col}`,
      'W': `${this.row}-${this.col - 1}`,
      'E': `${this.row}-${this.col + 1}`
    }
  }
}
