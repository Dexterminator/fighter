import {
  animations,
  animationStates,
  attackProperties,
  BLOCKING_STATES,
  CROUCHING_STATES, GAME_WIDTH,
  nextAnimationState,
  orientations,
  PLAYER_CROUCHING_HEIGHT,
  PLAYER_CROUCHING_Y,
  PLAYER_STANDING_HEIGHT,
  PLAYER_STARTING_Y,
  playerStates,
  READY_STATES,
  STANDING_STATES
} from "./constants"
import {easeInOutCubic, getTopY, isOverlapping} from "./math"

function updateHand(player) {
  const offset = BLOCKING_STATES.has(player.state) ? 0.5 : 0.8
  const hand = player.hand
  const number = player.orientation === orientations.FACING_RIGHT ? 1 : -1
  hand.x = player.x + player.width * offset * number
  if (player.state === playerStates.PUNCHING) {
    const anim = player.animation
    const stateConfig = animations.punch[anim.state]
    const progress = easeInOutCubic(anim.stateProgress / stateConfig.duration)
    const startOffset = stateConfig.startOffset * number
    const endOffset = stateConfig.endOffset * number
    hand.x += startOffset + (endOffset - startOffset) * progress
    anim.stateProgress++
    if (anim.stateProgress === stateConfig.duration) {
      anim.state = nextAnimationState[anim.state]
      anim.stateProgress = 0
    }

    if (anim.state === null) {
      player.state = playerStates.IDLE
    }
  }
  hand.y = getTopY(player) + hand.height * 1.8
}

function handleHit(player, otherPlayer) {
  if (otherPlayer.animation && otherPlayer.animation.state === animationStates.ACTIVE) {
    if (isOverlapping(player, otherPlayer.hand) && player.state !== playerStates.HITSTUN && player.state !== playerStates.BLOCKSTUN) {
      const blockedHighAttack = otherPlayer.hand.attackProperty === attackProperties.HIGH && player.state === playerStates.BLOCKING
      const blockedLowAttack = otherPlayer.hand.attackProperty === attackProperties.LOW && player.state === playerStates.CROUCH_BLOCKING
      if (!blockedHighAttack && !blockedLowAttack) {
        player.state = playerStates.HITSTUN
        player.hp -= 10
        player.stun = 25
        player.animation.state = null
        player.animation.stateProgress = 0
      } else {
        player.state = playerStates.BLOCKSTUN
        player.hp -= 3
        player.stun = 10
      }
    }
  }
}

function updatePlayer(player, otherPlayer, inputs) {
  const prevX = player.x
  if (player.state === playerStates.HITSTUN || player.state === playerStates.BLOCKSTUN) {
    player.stun--
    if (player.stun === 0) {
      player.state = playerStates.IDLE
    }
  }

  handleHit(player, otherPlayer)
  if (READY_STATES.has(player.state)) {
    if (!inputs.has('down') && CROUCHING_STATES.has(player.state)) {
      player.state = playerStates.IDLE
    }

    if (!inputs.has('block') && BLOCKING_STATES.has(player.state)) {
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
      if (CROUCHING_STATES.has(player.state)) {
        player.hand.attackProperty = attackProperties.LOW
      } else {
        player.hand.attackProperty = attackProperties.HIGH
      }
      player.state = playerStates.PUNCHING
      player.animation.state = animationStates.WINDUP
    } else if (inputs.has('block')) {
      if (CROUCHING_STATES.has(player.state)) {
        player.state = playerStates.CROUCH_BLOCKING
      } else {
        player.state = playerStates.BLOCKING
      }
    } else if (STANDING_STATES.has(player.state)) {
      if (inputs.has('left')) {
        player.x -= 10
      } else if (inputs.has('right')) {
        player.x += 10
      }
    }
  }

  if (isOverlapping(player, otherPlayer) || player.x < player.width * 0.7 || player.x > GAME_WIDTH - player.width * 0.7) {
    player.x = prevX
  }

  updateHand(player)
}

export function updateState(state, player1Inputs, player2Inputs) {
  state.inputs = {
    player1: player1Inputs,
    player2: player2Inputs
  }
  updatePlayer(state.player1, state.player2, player1Inputs)
  updatePlayer(state.player2, state.player1, player2Inputs)
}
