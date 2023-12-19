export default class Workflow {
  constructor(rawLine) {
    let [name, rules] = rawLine.split('{')

    this.name  = name
    this.rules = rules.replace('}', '')
                      .split(',')
                      .map(this.createRule)
  }

  createRule(rule) {
    let condition, destination = ''

    if (rule.includes(':')) {
      [condition, destination] = rule.split(':')
      return { type: 'eval', condition, destination }
    }
    else {
      return { type: 'send', destination: rule }
    }
  }

  /*
   * 3 responses allowed:
   *  - the name of next workflow
   *  - true  (accept the part)
   *  - false (reject the part)
   */
  process(part) {
    for (let i = 0; i < this.rules.length; i++) {
      let result = this.processRule(part, this.rules[i])
      if (result != undefined) return result
    }

    return "Oh nooooo, WTF happened"
  }

  processRule(part, rule) {
    let { x, m, a, s } = part

    if (rule.type == 'send' || eval(rule.condition)) {
      if (rule.destination == 'A') return true
      if (rule.destination == 'R') return false
      return rule.destination
    }
  }
}
