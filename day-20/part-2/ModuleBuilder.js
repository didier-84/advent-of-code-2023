export default class ModuleBuilder {
  static from(rawLine) {
    let [id, destinations] = rawLine.split(' -> ')

    if (id == 'broadcaster')
      return new Broadcaster(id, destinations)

    let name = id.slice(1)

    if (id.includes('%'))
      return new FlipFlop(name, destinations)

    if (id.includes('&'))
      return new Conjunction(name, destinations)
  }
}

class BaseModule {
  constructor(name, destinations) {
    this.name         = name
    this.destinations = destinations.split(', ')
  }

  generatePulses(intensity) {
    return this.destinations.map((d) => {
      return { name: d, intensity, source: this.name }
    })
  }
}

class Broadcaster extends BaseModule {
  constructor(name, destinations) {
    super(name, destinations)
    this.type = 'broadcaster'
  }

  receive(pulse) {
    return this.generatePulses(pulse.intensity)
  }
}

class FlipFlop extends BaseModule {
  constructor(name, destinations) {
    super(name, destinations)
    this.type   = 'flip-flop'
    this.status = false // off by default
  }

  receive(pulse) {
    if (pulse.intensity == 'high') return []

    let intensity = (this.status) ? 'low' : 'high'

    this.status = !this.status
    return this.generatePulses(intensity)
  }
}

class Conjunction extends BaseModule {
  constructor(name, destinations) {
    super(name, destinations)
    this.type   = 'conjunction'
    this.inputs = {}
  }

  receive(pulse) {
    this.inputs[pulse.source] = pulse.intensity

    let intensity = this.allInputsAreHigh() ? 'low' : 'high'
    return this.generatePulses(intensity)
  }

  allInputsAreHigh() {
    let result = true

    for (let name in this.inputs) {
      if (this.inputs[name] == 'low') result = false
    }

    return result
  }
}
