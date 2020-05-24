import {
  animationStates,
  BLOCKING_STATES,
  GAME_WIDTH,
  LIFE_BAR_WIDTH,
  PLAYER_1_COLOR,
  PLAYER_2_COLOR,
  playerStates,
  STARTING_HP
} from "./constants"
import {getLeftX, getTopY} from "./math"

const colorByAnimationState = {
  [animationStates.WINDUP]: '#00dc07',
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
  } else if (BLOCKING_STATES.has(player.state)) {
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

function renderLifeBar(ctx, player, x) {
  const offset = player.hp / STARTING_HP
  ctx.strokeRect(x, 40, LIFE_BAR_WIDTH, 30)
  ctx.fillRect(x, 40, Math.max(LIFE_BAR_WIDTH * offset, 0), 30)
}

export function renderState(ctx, state) {
  ctx.fillStyle = PLAYER_1_COLOR
  renderPlayer(ctx, state.player1)
  renderLifeBar(ctx, state.player1, 50)
  ctx.fillStyle = PLAYER_2_COLOR
  renderPlayer(ctx, state.player2)
  renderLifeBar(ctx, state.player2, GAME_WIDTH- LIFE_BAR_WIDTH - 50)

  ctx.fillStyle = PLAYER_1_COLOR
  renderHand(ctx, state.player1)
  ctx.fillStyle = PLAYER_2_COLOR
  renderHand(ctx, state.player2)
}
