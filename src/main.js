export const GAME_WIDTH = 1280
export const GAME_HEIGHT = 720

export function clear(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

export function render(state, ctx, canvas) {
  clear(ctx, canvas)
  ctx.fillStyle = 'lightblue'
  ctx.fillRect(state.x, state.y, state.width, state.height)
}

export function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

let framesDuration = 50

export function update(state) {
  if (state.progress < 1) {
    state.x = easeInOutCubic(state.progress) * GAME_WIDTH / 3
    state.progress += 1 / framesDuration
  }
}

function testScenario() {

}