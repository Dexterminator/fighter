import {orientations, PLAYER_1_COLOR, PLAYER_2_COLOR} from "./constants"
import {getLeftX, getTopY} from "./math"

function renderPlayer(ctx, player) {
  ctx.fillRect(getLeftX(player), getTopY(player), player.width, player.height)
  const circle = new Path2D()
  circle.moveTo(player.hand.x, player.hand.y)
  circle.arc(player.hand.x + player.hand.width * (player.orientation === orientations.FACING_RIGHT ? 1 : -1),
    player.hand.y, player.hand.width, 0, 2 * Math.PI)
  ctx.fill(circle)
}

export function renderState(ctx, state) {
  ctx.fillStyle = PLAYER_1_COLOR
  renderPlayer(ctx, state.player1)
  ctx.fillStyle = PLAYER_2_COLOR
  renderPlayer(ctx, state.player2)
}