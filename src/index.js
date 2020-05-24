import "./styles.css"
import {initCanvas, mainConstants, networkSendInputs, render, update} from "./main"
import {initGuestPeer, initHostPeer, testPeer} from "./network"

(function () {
  const canvas = initCanvas()
  const ctx = canvas.getContext("2d")
  let state = JSON.parse(mainConstants.initialState)
  let frames = 0
  const inputsByFrame = {}
  const statesByFrame = {}
  const debugConfig = {savedState: mainConstants.initialState}
  const remoteStatesByFrame = {}
  for (let i = 0; i < mainConstants.FRAME_DELAY; i++) {
    inputsByFrame[i] = new Set()
  }

  const currentInputs = new Set()
  const player2Inputs = new Set()
  window.addEventListener('keydown', function (e) {
    currentInputs.add(mainConstants.inputsByKey[e.code])
    player2Inputs.add(mainConstants.inputsByKey2[e.code])
    if (e.code === 'Space') {
      // initPeer()
    }
  })
  window.addEventListener('keyup', function (e) {
    currentInputs.delete(mainConstants.inputsByKey[e.code])
    player2Inputs.delete(mainConstants.inputsByKey2[e.code])
  })

  function main() {
    let stopMain = window.requestAnimationFrame(main)
    inputsByFrame[frames + mainConstants.FRAME_DELAY] = new Set(currentInputs)
    networkSendInputs(inputsByFrame)
    const player1Inputs = inputsByFrame[frames] || new Set()
    update(state, player1Inputs, player2Inputs)
    statesByFrame[frames] = JSON.stringify(state)
    render(state, ctx, canvas)
    frames++
    delete inputsByFrame[frames - 10]
    delete statesByFrame[frames - 10]
    if (state.player1.hp <= 0 || state.player2.hp <= 0) {
      frames = 0
      state = JSON.parse(mainConstants.initialState)
      // remoteInput = JSON.stringify({})
      // networkState = {latestSyncedFrame: -1}
    }
  }

  main()

  if (location.hash === '#host') {
    initHostPeer()
  } else if (location.hash === '#guest') {
    initGuestPeer()
  } else {

  }

  if (document.location.href.includes('localhost')) {
    // addDebug(state, debugConfig)
  }
})()

if (module.hot) {
  module.hot.accept('./main.js', function () {
    console.log('Index: Accepting the updated main module!')
  })
}
