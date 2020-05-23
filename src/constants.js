export const FRAME_DELAY = 3
export const PLAYER_1_COLOR = 'lightblue'
export const PLAYER_2_COLOR = 'darkcyan'
export const GAME_WIDTH = 1280
export const GAME_HEIGHT = 720
const PLAYER_STARTING_Y = 500
const HAND_WIDTH = 25
const PLAYER_WIDTH = 80
const PLAYER_HEIGHT = 250

export const orientations = {
  FACING_RIGHT: 1,
  FACING_LEFT: 2
}

export const playerStates = {
  IDLE: 0,
  WALKING: 1,
  PUNCHING: 2
}

export const animationStates = {
  STARTUP: 0,
  WINDUP: 1,
  ACTIVE: 2,
  RECOVERY: 3
}

export const nextAnimationState = {
  [animationStates.WINDUP]: animationStates.STARTUP,
  [animationStates.STARTUP]: animationStates.ACTIVE,
  [animationStates.ACTIVE]: animationStates.RECOVERY,
  [animationStates.RECOVERY]: null
}

export const READY_STATES = new Set([playerStates.IDLE, playerStates.WALKING])

const PUNCH_RANGE = PLAYER_WIDTH * 2
export const animations = {
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
}

const playerState = {
  state: playerStates.IDLE,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  y: PLAYER_STARTING_Y,
  animation: {
    state: null,
    stateProgress: 0
  },
  hand: {
    x: 0,
    y: 0,
    width: HAND_WIDTH,
    height: HAND_WIDTH,
  }
}
export const initialState = JSON.stringify({
  player1: Object.assign({
    x: PLAYER_WIDTH * 2,
    orientation: orientations.FACING_RIGHT
  }, playerState),
  player2: Object.assign({
    x: GAME_WIDTH - PLAYER_WIDTH * 2,
    orientation: orientations.FACING_LEFT
  }, playerState),
})

export const inputsByKey = {
  KeyA: 'left',
  KeyD: 'right',
  KeyS: 'down',
  KeyC: 'a',
  KeyV: 'block'
}
