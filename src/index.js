import "./styles.css"
import {render, update, mainConstants, addDebug, initCanvas, initPeer, networkSendInputs} from "./main"

(function () {
  const canvas = initCanvas()
  const ctx = canvas.getContext("2d")
  const state = JSON.parse(mainConstants.initialState)
  let frames = 0
  // initPeer()
  const inputsByFrame = {}
  const statesByFrame = {}
  const debugConfig = {savedState: mainConstants.initialState}

  const currentInputs = new Set()
  window.addEventListener('keydown', function (e) {
    currentInputs.add(mainConstants.inputsByKey[e.code])
  })
  window.addEventListener('keyup', function (e) {
    currentInputs.delete(mainConstants.inputsByKey[e.code])
  })

  function main() {
    let stopMain = window.requestAnimationFrame(main)
    inputsByFrame[frames + mainConstants.FRAME_DELAY] = new Set(currentInputs)
    networkSendInputs(inputsByFrame)
    const player1Inputs = inputsByFrame[frames] || new Set()
    const player2Inputs = new Set()
    update(state, player1Inputs, player2Inputs)
    statesByFrame[frames] = JSON.stringify(state)
    render(state, ctx, canvas)
    frames++
    delete inputsByFrame[frames - 10]
    delete statesByFrame[frames - 10]
  }

  main()
  addDebug(state, debugConfig)
})()

if (module.hot) {
  module.hot.accept('./main.js', function () {
    console.log('Index: Accepting the updated main module!')
  })
}
