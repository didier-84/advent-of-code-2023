// Helper
let point = (x, y) => ({ x, y })

// Test on a simple square of 4 x 4 blocks
//
// ####
// #..#
// #..#
// ####
//
// The total must be 16 blocks
const testAlgoOnSimpleSquare = () => {
  console.log('Simple square of 4 x 4 blocks')

  const points = [
    point(0, 0), point(0, 3),
    point(3, 3), point(3, 0),
    point(0, 0)
  ]

  // Digging 3, turning, digging 3, turning...
  const perimeterBlocks = 3 + 3 + 3 + 3

  testAlgo(points, perimeterBlocks)
  console.log('---')
}

// Test on a simple cross in 9 x 9 grid
//
//    ###
//    #.#
//    #.#
// ####.####
// #.......#
// ####.####
//    #.#
//    #.#
//    ###
//
// The total must be 45 blocks
const testAlgoOnSimpleCross = () => {
  console.log('Simple cross of 5 squares of 9 blocks')

  const points = [
    point(3, 0), point(5, 0),
    point(5, 3), point(8, 3),
    point(8, 5), point(5, 5),
    point(5, 8), point(3, 8),
    point(3, 5), point(0, 5),
    point(0, 3), point(3, 3),
    point(3, 0)
  ]

  // Digging 2, turning, digging 3, turning, digging 3...
  const perimeterBlocks = (2 + 3 + 3) * 4

  testAlgo(points, perimeterBlocks)
  console.log('---')
}

const testAlgo = (points, perimeterBlocks) => {
  let total = 0
  let area  = 0

  // The infamous algorithm
  for (let i = 0; i < points.length - 1; i++) {
    let p1 = points[i]
    let p2 = points[i + 1]

    let a  = (p1.x * p2.y)
    let b  = (p2.x * p1.y)

    area += (a - b)
  }

  total += Math.abs(area)
  total += perimeterBlocks
  total /= 2
  total += 1

  console.log('Total:', total)
}

export default {testAlgoOnSimpleSquare, testAlgoOnSimpleCross}
