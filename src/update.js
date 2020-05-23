import {
  animations,
  animationStates,
  nextAnimationState,
  orientations,
  PLAYER_CROUCHING_HEIGHT, PLAYER_CROUCHING_Y, PLAYER_STANDING_HEIGHT, PLAYER_STARTING_Y,
  playerStates,
  READY_STATES, STANDING_STATES
} from "./constants"
import {easeInOutCubic, getTopY, isOverlapping} from "./math"

function updateHand(player) {
  const offset = player.state === playerStates.BLOCKING ? 0.5 : 0.8
  const hand = player.hand
  hand.x = player.x + player.width * offset * (player.orientation === orientations.FACING_RIGHT ? 1 : -1)
  if (player.state === playerStates.PUNCHING) {
    const anim = player.animation
    const stateConfig = animations.punch[anim.state]
    const progress = easeInOutCubic(anim.stateProgress / stateConfig.duration)
    hand.x += stateConfig.startOffset + (stateConfig.endOffset - stateConfig.startOffset) * progress
    anim.stateProgress++
    if (anim.stateProgress === stateConfig.duration) {
      anim.state = nextAnimationState[anim.state]
      anim.stateProgress = 0
    }

    if (anim.state === null) {
      player.state = playerStates.IDLE
    }
  }
  hand.y = getTopY(player) + hand.height * 2
}

function handleHit(player, otherPlayer) {
  if (otherPlayer.animation && otherPlayer.animation.state === animationStates.ACTIVE) {
    if (isOverlapping(player, otherPlayer.hand) && player.state !== playerStates.BLOCKING) {
      player.state = playerStates.HITSTUN
    }
  }
}

function updatePlayer(player, otherPlayer, inputs) {
  handleHit(player, otherPlayer)

  if (READY_STATES.has(player.state)) {
    if (!inputs.has('down') && player.state === playerStates.CROUCHING) {
      player.state = playerStates.IDLE
    }

    if (!inputs.has('block') && player.state === playerStates.BLOCKING) {
      player.state = playerStates.IDLE
    }

    if (inputs.has('down')) {
      player.state = playerStates.CROUCHING
      player.height = PLAYER_CROUCHING_HEIGHT
      player.y = PLAYER_CROUCHING_Y
    } else {
      player.height = PLAYER_STANDING_HEIGHT
      player.y = PLAYER_STARTING_Y
    }

    if (inputs.has('a')) {
      player.state = playerStates.PUNCHING
      player.animation.state = animationStates.WINDUP
    } else if (inputs.has('block')) {
      player.state = playerStates.BLOCKING
    } else if (STANDING_STATES.has(player.state)) {
      if (inputs.has('left')) {
        player.x -= 10
      } else if (inputs.has('right')) {
        player.x += 10
      }
    }
  }
  updateHand(player)
}

export function updateState(state, player1Inputs, player2Inputs) {
  updatePlayer(state.player1, state.player2, player1Inputs)
  updatePlayer(state.player2, state.player1, player2Inputs)
}
