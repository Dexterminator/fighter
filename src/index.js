import "./styles.css"
import {addDebug, initCanvas, mainConstants, render, update} from "./main"
import {encodeInput, initGuestPeer, initHostPeer, parseRemoteInput, resolveNetworking, testPeer} from "./network"

export function networkSendInputs(peer, inputsByFrame) {
  const json = encodeInput(inputsByFrame)
  peer.send(json)
}

export function startGame(peer, playerId) {
  let networkState = {
    latestSyncedFrame: -1,
    remoteInputByFrame: JSON.stringify({})
  }

  peer.on('data', data => {
    networkState.remoteInputByFrame = data
  })

  const canvas = initCanvas()
  const ctx = canvas.getContext("2d")
  let state = JSON.parse(mainConstants.initialState)
  let frames = 0
  const localInputsByFrame = {}
  const statesByFrame = {'-1': mainConstants.initialState}
  const debugConfig = {savedState: mainConstants.initialState}
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

  let hasWinner = false
  function main() {
    let stopMain = window.requestAnimationFrame(main)
    localInputsByFrame[frames + mainConstants.FRAME_DELAY] = new Set(currentInputs)
    networkSendInputs(peer, localInputsByFrame)
    let [newLatestSyncedFrame, newInputsByFrame, newState] = resolveNetworking(localInputsByFrame, networkState.remoteInputByFrame, statesByFrame, networkState.latestSyncedFrame, frames)
    state = newState
    networkState.latestSyncedFrame = newLatestSyncedFrame
    const localInputs = localInputsByFrame[frames]
    if (playerId === 'player1') {
      update(state, localInputs, newInputsByFrame[frames])
    } else {
      update(state, newInputsByFrame[frames], localInputs)
    }

    statesByFrame[frames] = JSON.stringify(state)
    render(state, ctx, canvas)
    frames++
    delete localInputsByFrame[frames - 30]
    delete statesByFrame[frames - 30]
    if (state.player1.hp <= 0 && !hasWinner) {
      const h1 = document.createElement('h1')
      h1.textContent = 'Player 2 wins!'
      document.body.append(h1)
      hasWinner = true
    }

    if (state.player2.hp <= 0 && !hasWinner) {
      const h1 = document.createElement('h1')
      h1.textContent = 'Player 1 wins!'
      document.body.append(h1)
      hasWinner = true
    }

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
    addDebug()
  }
})()

if (module.hot) {
  module.hot.accept('./main.js', function () {
    console.log('Index: Accepting the updated main module!')
  })
}
