export default class Pattern {

  constructor(pattern, options = { factor: 1, transpose: false }) {
    this.rows      = pattern.split('\n')

    this.transpose = options.transpose
    this.factor    = options.factor

    if (this.transpose) {
      this.rows = Pattern.transpose(this.rows)
    }
  }

  computeReflection() {
    for (let index = 1; index < this.rows.length; index++) {
      if (this.hasPerfectReflectionAt(index)) {
        return this.factor * (index)
      }
    }
  }

  hasPerfectReflectionAt(index) {
    let i = index - 1
    let j = index

    while(i >= 0 && j < this.rows.length) {
      if (this.rows[i] !== this.rows[j]) return false

      i -= 1
      j += 1
    }
    return true;
  }

  // Static method
  static transpose(rows) {
    let cols = []

    for (let i = 0; i < rows[0].length; i++) {
      let col = ''
      for (let j = 0; j < rows.length; j++ ) {
        col += rows[j][i]
      }
      cols.push(col)
    }
    return cols
  }
}
