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

const playerState = {
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  y: PLAYER_STARTING_Y,
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
  KeyC: 'block',
  KeyV: 'a'
}
