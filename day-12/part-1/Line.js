export default class Line {

  constructor(rawLine) {
    let [springs, groups] = rawLine.split(' ')

    this.springs = springs
    this.groups  = groups.split(',').map((group) => parseInt(group))
  }

  startsWithUnknown() {
    let regex = new RegExp(/^\?/);
    return regex.test(this.springs)
  }

  endsWithUnknown() {
    let regex = new RegExp(/\?$/);
    return regex.test(this.springs)
  }

  clearExcessiveDots() {
    // Clear leading, trailing and repeted dots
    this.springs = this.springs.replace(/^\.+/, '')
                               .replace(/\.+$/, '')
                               .replace(/\.+/g, '.')
  }

  clearAllLeadingGroups() {
    let keepGoing = true

    while (keepGoing) {
      this.clearExcessiveDots()

      let currentSize = parseInt(this.springs.length)

      this.clearLeadingGroup()

      if (this.startsWithUnknown() || (currentSize == this.springs.length)) {
        keepGoing = false
      }
    }
  }

  clearLeadingGroup() {
    let first   = this.groups.at(0)
    let regex   = new RegExp(/^\#/);

    if (!regex.test(this.springs)) return

    this.springs = this.springs.slice(first)
                               .slice(1) // Must be a '.'
    this.groups.shift()
  }

  clearAllTrailingGroups() {
    let keepGoing = true

    while (keepGoing) {
      this.clearExcessiveDots()

      let currentSize = parseInt(this.springs.length)

      this.clearTrailingGroup()

      if (this.endsWithUnknown() || (currentSize == this.springs.length)) {
        keepGoing = false
      }
    }
  }

  clearTrailingGroup() {
    let last  = this.groups.at(-1)
    let regex = new RegExp(/\#$/);

    if (!regex.test(this.springs)) return

    this.springs = this.springs.slice(0, -(last))
                               .slice(0, -1) // Must be a '.'
    this.groups.pop()
  }

  countTotalArrangements() {
    return Line.countArrangements(this.springs, this.groups)
  }

  static countArrangements(springs, groups) {
    // Early exit: no more springs to check
    if (springs == '') {
      // Any groups left? --> Not a valid arrangement
      if (groups.length > 0) return 0
      else return 1 // We've reached the end of this arrangement
    }

    // Early exit: no more groups to arrange
    if (groups.length == 0) {
      // Any block left? --> Not a valid arrangement
      if (springs.includes('#')) return 0
      else return 1 // We've reached the end of this arrangement
    }

    // We need to continue looking
    let count = 0
    let current   = springs[0]

    // Skip this one, it's a separator
    if (current == '.') {
      count += Line.countArrangements(springs.slice(1), groups)
    }

    // Branching out
    if (current == '?') {
      count += Line.countArrangements(springs.slice(1), groups)
    }

    // Trying to fit the first group
    if (current == '#' || current == '?') {
      let groupSize  = groups[0]
      let groupSprings = springs.slice(0, groupSize)

      let enoughRoom = springs.length >= groupSize
      let noMoreDots = !groupSprings.includes('.')

      // Ok, we can attempt it
      if (enoughRoom && noMoreDots) {
        let nextSpringAfterGroup = springs[groupSize] || ''

        // Only if the group is not followed by a block
        if (nextSpringAfterGroup != "#") {
          let remainingSprings = springs.slice(groupSize + 1)
          let remainingGroups  = groups.slice(1)

          count += Line.countArrangements(remainingSprings, remainingGroups)
        }
      }
    }

    return count
  }
}
