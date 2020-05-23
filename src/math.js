// if (state.progress < 1) {
//   state.x = easeInOutCubic(state.progress) * GAME_WIDTH / 3
//   state.progress += 1 / framesDuration
// }

export function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

export function getLeftX(object) {
  return object.x - 0.5 * object.width
}

export function getTopY(object) {
  return object.y - 0.5 * object.height
}