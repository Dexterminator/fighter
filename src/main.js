

export function clear(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function renderPlayer(ctx, playerState) {
  ctx.fillRect(playerState.x, playerState.y, playerState.width, playerState.height)
}

export function render(state, ctx, canvas) {
  clear(ctx, canvas)
  ctx.fillStyle = 'lightblue'
  renderPlayer(ctx, state.player1)
  ctx.fillStyle = 'darkcyan'
  renderPlayer(ctx, state.player2)
}

export function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

function updatePlayer(player, inputs) {
  if (inputs.has("left")) {
    player.x -= 10
  } else if (inputs.has("right")) {
    player.x += 10
  }
}

export function update(state, player1Inputs = new Set(), player2Inputs = new Set()) {
  updatePlayer(state.player1, player1Inputs)
  updatePlayer(state.player2, player2Inputs)
  // if (state.progress < 1) {
  //   state.x = easeInOutCubic(state.progress) * GAME_WIDTH / 3
  //   state.progress += 1 / framesDuration
  // }
}
