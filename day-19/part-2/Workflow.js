export default class Workflow {
  constructor(rawLine) {
    let [name, rules] = rawLine.split('{')

    this.name  = name
    this.rules = rules.replace('}', '')
                      .split(',')
                      .map((rule) => this.createRule(rule))

    this.resetRanges()
  }

  resetRanges() {
    this.ranges = {
      accepted: [],
      redirect: [],
      continue: []
    }
  }

  createRule(rule) {
    let condition, destination = ''

    if (rule.includes(':')) {
      [condition, destination] = rule.split(':')
      condition = this.decomposeCondition(condition)
      return { type: 'eval', condition, destination }
    } else {
      return { type: 'send', destination: rule }
    }
  }

  decomposeCondition(condition) {
    let operator     = condition.includes('<') ? '<' : '>'
    let [cat, bound] = condition.split(operator)

    bound = parseInt(bound)
    return { cat, bound, operator }
  }

  processRange(sourceRange) {
    let resultingRanges = {}
    let rangesToProcess = [sourceRange]

    for (let i = 0; i < this.rules.length; i++) {
      rangesToProcess.forEach((range, index) => {
        this.processRule(range, this.rules[i])
      })

      rangesToProcess = [...this.ranges.continue]
      this.ranges.continue = []
    }

    resultingRanges = {...this.ranges}
    this.resetRanges()

    return resultingRanges
  }

  processRule(sourceRange, rule) {
    let resultingRanges = []

    if (rule.type == 'eval') {
      resultingRanges = this.splitRangeOnRuleCondition(sourceRange, rule.condition)
    } else {
      resultingRanges = [{ range: sourceRange, pass: true }]
    }

    resultingRanges.forEach((range) => {
      if (range.pass) {
        if (rule.destination == 'A') {
          this.ranges.accepted.push(range.range)
        }
        else if (rule.destination == 'R') {
          // Do nothing with rejected ranges
        }
        else {
          this.ranges.redirect.push({
            name:  rule.destination,
            range: range.range
          })
        }
      } else {
        this.ranges.continue.push(range.range)
      }
    })
  }

  splitRangeOnRuleCondition(sourceRange, condition) {
    let { cat, bound, operator } = condition

    let resultingRanges = []
    let range = {}

    if (operator == '<') {
      // Range already too high - FAIL
      if (sourceRange[cat].start > bound) {
        return [{ range: sourceRange, pass: false }]
      }

      // Range end matches bound - SUCCESS
      if (sourceRange[cat].end == bound) {
        return [{ range: sourceRange, pass: true }]
      }

      // Else: split into two ranges (SUCCESS & FAIL)
      range = {...sourceRange}
      range[cat] = {
        start: range[cat].start,
        end:   bound - 1
      }
      resultingRanges.push({ range, pass: true })

      range = {...sourceRange}
      range[cat] = {
        start: bound,
        end:   range[cat].end
      }
      resultingRanges.push({ range, pass: false })
    }
    else if (operator == '>') {
      // Range already too low - FAIL
      if (sourceRange[cat].end < bound) {
        return [{ range: sourceRange, pass: false }]
      }

      // Range start matches bound - SUCCESS
      if (sourceRange[cat].start == bound) {
        return [{ range: sourceRange, pass: true }]
      }

      // Else: split into two ranges (SUCCESS & FAIL)
      range = {...sourceRange}
      range[cat] = {
        start: bound + 1,
        end:   range[cat].end
      }
      resultingRanges.push({ range, pass: true })

      range = {...sourceRange}
      range[cat] = {
        start: range[cat].start,
        end:   bound
      }
      resultingRanges.push({ range, pass: false })
    }

    return resultingRanges
  }
}
