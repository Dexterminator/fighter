import {updateHand} from "./update"

export const FRAME_DELAY = 3
export const PLAYER_1_COLOR = 'lightblue'
export const PLAYER_2_COLOR = 'darkcyan'
export const GAME_WIDTH = 1280
export const GAME_HEIGHT = 720
export const PLAYER_STANDING_HEIGHT = 250
export const PLAYER_CROUCHING_HEIGHT = 150
export const PLAYER_STARTING_Y = 500
export const PLAYER_CROUCHING_Y = PLAYER_STARTING_Y + (PLAYER_STANDING_HEIGHT - PLAYER_CROUCHING_HEIGHT) * 0.5
export const STARTING_HP = 100
export const LIFE_BAR_WIDTH = 300
export const MAX_PREDICTION_WINDOW = 8
const HAND_WIDTH = 40
const PLAYER_WIDTH = 80

export const orientations = {
  FACING_RIGHT: 1,
  FACING_LEFT: 2
}

export const playerStates = {
  IDLE: 0,
  WALKING: 1,
  CROUCHING: 2,
  PUNCHING: 3,
  BLOCKING: 4,
  CROUCH_BLOCKING: 5,
  HITSTUN: 6,
  BLOCKSTUN: 7
}

export const animationStates = {
  STARTUP: 0,
  WINDUP: 1,
  ACTIVE: 2,
  RECOVERY: 3
}

export const attackProperties = {
  HIGH: 0,
  LOW: 1
}

export const nextAnimationState = {
  [animationStates.WINDUP]: animationStates.STARTUP,
  [animationStates.STARTUP]: animationStates.ACTIVE,
  [animationStates.ACTIVE]: animationStates.RECOVERY,
  [animationStates.RECOVERY]: null
}

export const READY_STATES = new Set([playerStates.IDLE, playerStates.WALKING, playerStates.CROUCHING, playerStates.BLOCKING, playerStates.CROUCH_BLOCKING])
export const STANDING_STATES = new Set([playerStates.IDLE, playerStates.WALKING])
export const CROUCHING_STATES = new Set([playerStates.CROUCHING, playerStates.CROUCH_BLOCKING])
export const BLOCKING_STATES = new Set([playerStates.BLOCKING, playerStates.CROUCH_BLOCKING, playerStates.BLOCKSTUN])

const PUNCH_RANGE = PLAYER_WIDTH * 1.5
export const animations = Object.freeze({
  punch: {
    [animationStates.WINDUP]: {
      duration: 5,
      startOffset: 0,
      endOffset: -20
    },
    [animationStates.STARTUP]: {
      duration: 5,
      startOffset: 0,
      endOffset: PUNCH_RANGE
    },
    [animationStates.ACTIVE]: {
      duration: 5,
      startOffset: PUNCH_RANGE,
      endOffset: PUNCH_RANGE
    },
    [animationStates.RECOVERY]: {
      duration: 15,
      startOffset: PUNCH_RANGE,
      endOffset: 0
    },
  }
})

function addHand(player) {
  const hand = {
    x: 0,
    y: 0,
    width: HAND_WIDTH,
    height: HAND_WIDTH,
    attackProperty: attackProperties.HIGH
  }
  player.hand = hand
  updateHand(player)
  return player
}

const playerState = {
  state: playerStates.IDLE,
  width: PLAYER_WIDTH,
  height: PLAYER_STANDING_HEIGHT,
  y: PLAYER_STARTING_Y,
  hp: STARTING_HP,
  stun: 0,
  animation: {
    state: null,
    stateProgress: 0
  }
}

const initialPlayer1State = Object.assign({
  id: 'player1',
  x: PLAYER_WIDTH * 2,
  orientation: orientations.FACING_RIGHT
}, playerState)

const initialPlayer2State = Object.assign({
  id: 'player2',
  x: GAME_WIDTH - PLAYER_WIDTH * 2,
  orientation: orientations.FACING_LEFT
}, playerState)

export const initialState = JSON.stringify({
  player1Inputs: [],
  player2Inputs: [],
  player1: addHand(initialPlayer1State),
  player2: addHand(initialPlayer2State),
})

export const inputsByKey = {
  KeyA: 'left',
  KeyD: 'right',
  KeyS: 'down',
  KeyC: 'a',
  KeyV: 'block'
}

export const inputsByKey2 = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowDown: 'down',
  Enter: 'a',
  ShiftRight: 'block'
}
