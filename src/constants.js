export const FRAME_DELAY = 3
export const GAME_WIDTH = 1280
export const GAME_HEIGHT = 720
const PLAYER_WIDTH = 80
const PLAYER_HEIGHT = 200

export const inputsByKey = {
  KeyA: 'left',
  KeyD: 'right',
  KeyS: 'down',
  KeyC: 'a',
  KeyV: 'b'
}

const playerState = {
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  y: 450
}

export const initialState = JSON.stringify({
  player1: Object.assign({x: PLAYER_WIDTH * 2}, playerState),
  player2: Object.assign({x: GAME_WIDTH - PLAYER_WIDTH * 3}, playerState),
})
