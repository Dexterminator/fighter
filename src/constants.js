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
  HITSTUN: 5
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

export const READY_STATES = new Set([playerStates.IDLE, playerStates.WALKING, playerStates.CROUCHING, playerStates.BLOCKING])
export const STANDING_STATES = new Set([playerStates.IDLE, playerStates.WALKING])

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
  height: PLAYER_STANDING_HEIGHT,
  y: PLAYER_STARTING_Y,
  hp: STARTING_HP,
  stun: 0,
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
    id: 'player1',
    x: PLAYER_WIDTH * 2,
    orientation: orientations.FACING_RIGHT
  }, playerState),
  player2: Object.assign({
    id: 'player2',
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
