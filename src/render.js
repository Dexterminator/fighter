import {animationStates, orientations, PLAYER_1_COLOR, PLAYER_2_COLOR, playerStates} from "./constants"
import {getLeftX, getTopY} from "./math"

const colorByAnimationState = {
  [animationStates.ACTIVE]: '#dc4776',
}

function renderHand(ctx, player) {
  const circle = new Path2D()
  const hand = player.hand
  circle.moveTo(getLeftX(hand), hand.y)
  circle.arc(getLeftX(hand) + hand.width * 0.5, hand.y, hand.width * 0.5, 0, 2 * Math.PI)
  const fillStyle = ctx.fillStyle
  if (player.state === playerStates.PUNCHING) {
    ctx.fillStyle = colorByAnimationState[player.animation.state] || fillStyle
  } else if (player.state === playerStates.BLOCKING) {
    ctx.fillStyle = '#2aaadc'
  }
  ctx.fill(circle)
  // draw hitbox
  // ctx.strokeRect(getLeftX(hand), getTopY(hand), hand.width, hand.height)
}

function renderPlayer(ctx, player) {
  if (player.state === playerStates.HITSTUN) {
    ctx.globalAlpha = 0.5
  }
  ctx.fillRect(getLeftX(player), getTopY(player), player.width, player.height)
  ctx.globalAlpha = 1
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
