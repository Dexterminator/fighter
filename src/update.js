import {orientations} from "./constants"
import {getTopY} from "./math"

function updateHand(player) {
  const offset = 0.6
  player.hand.x = player.x + player.width * offset * (player.orientation === orientations.FACING_RIGHT ? 1 : -1)
  player.hand.y = getTopY(player) + player.hand.height * 2
}

function updatePlayer(player, inputs) {
  if (inputs.has("left")) {
    player.x -= 10
  } else if (inputs.has("right")) {
    player.x += 10
  }
  updateHand(player)
}

export function updateState(state, player1Inputs, player2Inputs) {
  updatePlayer(state.player1, player1Inputs)
  updatePlayer(state.player2, player2Inputs)
}