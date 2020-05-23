import {animationStates, orientations, PLAYER_1_COLOR, PLAYER_2_COLOR, playerStates} from "./constants"
import {getLeftX, getTopY} from "./math"

const colorByAnimationState = {
  [animationStates.ACTIVE]: '#DC143C',
}

function renderHand(ctx, player) {
  const circle = new Path2D()
  circle.moveTo(player.hand.x, player.hand.y)
  circle.arc(player.hand.x + player.hand.width * (player.orientation === orientations.FACING_RIGHT ? 1 : -1),
    player.hand.y, player.hand.width, 0, 2 * Math.PI)
  const fillStyle = ctx.fillStyle
  if (player.state === playerStates.PUNCHING) {
    ctx.fillStyle = colorByAnimationState[player.animation.state] || fillStyle
  }
  ctx.fill(circle)

}

function renderPlayer(ctx, player) {
  ctx.fillRect(getLeftX(player), getTopY(player), player.width, player.height)
}

export function renderState(ctx, state) {
  ctx.fillStyle = PLAYER_1_COLOR
  renderPlayer(ctx, state.player1)
  ctx.fillStyle = PLAYER_2_COLOR
  renderPlayer(ctx, state.player2)

  ctx.fillStyle = PLAYER_1_COLOR
  renderHand(ctx, state.player1)
  ctx.fillStyle = PLAYER_2_COLOR
  renderHand(ctx, state.player2)
}
