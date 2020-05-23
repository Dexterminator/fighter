import {animations, animationStates, nextAnimationState, orientations, playerStates, READY_STATES} from "./constants"
import {easeInOutCubic, getTopY} from "./math"

function updateHand(player) {
  const offset = 0.6
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

function updatePlayer(player, inputs) {
  if (READY_STATES.has(player.state)) {
    if (inputs.has("a")) {
      player.state = playerStates.PUNCHING
      player.animation.state = animationStates.WINDUP
    } else if (inputs.has("left")) {
      player.x -= 10
    } else if (inputs.has("right")) {
      player.x += 10
    }
  }
  updateHand(player)
}

export function updateState(state, player1Inputs, player2Inputs) {
  updatePlayer(state.player1, player1Inputs)
  updatePlayer(state.player2, player2Inputs)
}