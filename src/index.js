import "./styles.css"
import {initCanvas, mainConstants, render, update} from "./main"
import {encodeInput, initGuestPeer, initHostPeer, resolveNetworking} from "./network"
import {MAX_PREDICTION_WINDOW} from "./constants"

export function networkSendInputs(peer, inputsByFrame) {
  const json = encodeInput(inputsByFrame)
  peer.send(json)
}

function initGame() {
  const canvas = initCanvas()
  const ctx = canvas.getContext("2d")
  const localInputsByFrame = {}
  for (let i = 0; i < mainConstants.FRAME_DELAY; i++) {
    localInputsByFrame[i] = new Set()
  }

  const currentInputs = new Set()
  // const player2Inputs = new Set()
  window.addEventListener('keydown', function (e) {
    currentInputs.add(mainConstants.inputsByKey[e.code])
    // player2Inputs.add(mainConstants.inputsByKey2[e.code])
  })

  window.addEventListener('keyup', function (e) {
    currentInputs.delete(mainConstants.inputsByKey[e.code])
    // player2Inputs.delete(mainConstants.inputsByKey2[e.code])
  })

  return {
    state: JSON.parse(mainConstants.initialState),
    frames: 0,
    canvas: canvas,
    ctx: ctx,
    localInputsByFrame: localInputsByFrame,
    statesByFrame: {'-1': mainConstants.initialState},
    debugConfig: {savedState: mainConstants.initialState},
    currentInputs: currentInputs,
    latestSyncedFrame: -1,
    remoteInputByFrame: JSON.stringify({}),
    hasWinner: false,
  }
}

// TODO: DO this in update() instead
function checkWinner(game) {
  if (game.state.player1.hp <= 0 && !game.hasWinner) {
    const h1 = document.createElement('h1')
    h1.textContent = 'Player 2 wins!'
    document.body.append(h1)
    game.hasWinner = true
  }

  if (game.state.player2.hp <= 0 && !game.hasWinner) {
    const h1 = document.createElement('h1')
    h1.textContent = 'Player 1 wins!'
    document.body.append(h1)
    game.hasWinner = true
  }
}

function advanceFrame(game) {
  game.statesByFrame[game.frames] = JSON.stringify(game.state)
  game.frames++
  delete game.localInputsByFrame[game.frames - MAX_PREDICTION_WINDOW]
  delete game.statesByFrame[game.frames - MAX_PREDICTION_WINDOW]
}

export function startGame(peer, playerId) {
  const game = initGame()

  peer.on('data', data => game.remoteInputByFrame = data)

  function main() {
    let stopMain = window.requestAnimationFrame(main)
    game.localInputsByFrame[game.frames + mainConstants.FRAME_DELAY] = new Set(game.currentInputs)

    // TODO: Do this conditionally
    // TODO: Better terminology for local/remote and player1/player2
    networkSendInputs(peer, game.localInputsByFrame)
    let [newLatestSyncedFrame, newInputsByFrame, newState] = resolveNetworking(game.localInputsByFrame, game.remoteInputByFrame, game.statesByFrame, game.latestSyncedFrame, game.frames)
    game.state = newState
    game.latestSyncedFrame = newLatestSyncedFrame
    const localInputs = game.localInputsByFrame[game.frames]
    if (playerId === 'player1') {
      update(game.state, localInputs, newInputsByFrame[game.frames])
    } else {
      update(game.state, newInputsByFrame[game.frames], localInputs)
    }

    render(game.state, game.ctx, game.canvas)
    advanceFrame(game)

    // if (state.player1.hp <= 0 || state.player2.hp <= 0) {
    //   frames = 0
    //   state = JSON.parse(mainConstants.initialState)
    //   networkState.remoteInputByFrame = {}
    //   networkState.latestSyncedFrame = -1
    // }
  }

  main()
}

(function () {
  if (location.hash === '#host') {
    initHostPeer()
  } else if (location.hash === '#guest') {
    initGuestPeer()
  } else {
    const div = document.createElement('div')
    div.textContent = 'Go to https://fight.dxtr.se/#guest or https://fight.dxtr.se/#host to play online!'
    document.body.append(div)
  }

  if (document.location.href.includes('localhost')) {
    // addDebug()
  }
})()

if (module.hot) {
  module.hot.accept('./main.js', function () {
    console.log('Index: Accepting the updated main module!')
  })
}
