import "./styles.css"
import {initCanvas, mainConstants, render, update} from "./main"
import {encodeInput, initGuestPeer, initHostPeer, resolveNetworking} from "./network"
import {MAX_PREDICTION_WINDOW} from "./constants"

export function networkSendInputs(peer, inputsByFrame) {
  const json = encodeInput(inputsByFrame)
  peer.send(json)
}

function initGame(peer) {
  const canvas = initCanvas()
  const ctx = canvas.getContext("2d")
  const localInputsByFrame = {}
  const localInputsByFrame2 = {}
  for (let i = 0; i < mainConstants.FRAME_DELAY; i++) {
    localInputsByFrame[i] = new Set()
    localInputsByFrame2[i] = new Set()
  }

  const currentInputs = new Set()
  const currentInputs2 = new Set()
  window.addEventListener('keydown', function (e) {
    currentInputs.add(mainConstants.inputsByKey[e.code])
    if (!peer) {
      currentInputs2.add(mainConstants.inputsByKey2[e.code])
    }
  })

  window.addEventListener('keyup', function (e) {
    currentInputs.delete(mainConstants.inputsByKey[e.code])
    if (!peer) {
      currentInputs2.delete(mainConstants.inputsByKey2[e.code])
    }
  })

  const game = {
    state: JSON.parse(mainConstants.initialState),
    frames: 0,
    canvas: canvas,
    ctx: ctx,
    localInputsByFrame: localInputsByFrame,
    localInputsByFrame2: localInputsByFrame2,
    statesByFrame: {'-1': mainConstants.initialState},
    debugConfig: {savedState: mainConstants.initialState},
    currentInputs: currentInputs,
    currentInputs2: currentInputs2,
    latestSyncedFrame: -1,
    remoteInputByFrame: JSON.stringify({}),
    hasWinner: false,
  }

  if (peer) {
    peer.on('data', data => game.remoteInputByFrame = data)
  }

  return game
}

function advanceFrame(game) {
  game.statesByFrame[game.frames] = JSON.stringify(game.state)
  game.frames++
  delete game.localInputsByFrame[game.frames - MAX_PREDICTION_WINDOW]
  delete game.localInputsByFrame2[game.frames - MAX_PREDICTION_WINDOW]
  delete game.statesByFrame[game.frames - MAX_PREDICTION_WINDOW]
}

function resolveInputsAndState(peer, game, playerId) {
  let player1Inputs = null
  let player2Inputs = null

  if (peer) {
    networkSendInputs(peer, game.localInputsByFrame)
    let [newLatestSyncedFrame, newRemoteInputsByFrame, newState] = resolveNetworking(game.localInputsByFrame, game.remoteInputByFrame, game.statesByFrame, game.latestSyncedFrame, game.frames, playerId)
    game.state = newState
    game.latestSyncedFrame = newLatestSyncedFrame
    if (playerId === 'player1') {
      player1Inputs = game.localInputsByFrame[game.frames]
      player2Inputs = newRemoteInputsByFrame[game.frames]
    } else {
      player1Inputs = newRemoteInputsByFrame[game.frames]
      player2Inputs = game.localInputsByFrame[game.frames]
    }
  } else {
    player1Inputs = game.localInputsByFrame[game.frames]
    player2Inputs = game.localInputsByFrame2[game.frames]
  }

  return {player1Inputs, player2Inputs}
}

function readInputs(game, peer) {
  game.localInputsByFrame[game.frames + mainConstants.FRAME_DELAY] = new Set(game.currentInputs)
  if (!peer) {
    game.localInputsByFrame2[game.frames + mainConstants.FRAME_DELAY] = new Set(game.currentInputs2)
  }
}

export function startGame(peer = null, playerId = null) {
  const game = initGame(peer)

  function main() {
    let stopMain = window.requestAnimationFrame(main)
    readInputs(game, peer)
    let {player1Inputs, player2Inputs} = resolveInputsAndState(peer, game, playerId)
    update(game.state, player1Inputs, player2Inputs)
    render(game.state, game.ctx, game.canvas)
    advanceFrame(game)
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
    startGame(null, null)
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
