import "./styles.css"
import {render, update} from "./main"
import {initCanvas} from "./dom"
import {FRAME_DELAY, initialState} from "./constants"
import {addDebug, test1, test2} from "./debug"
import {initPeer, networkSendInputs} from "./network"

(function () {
  const canvas = initCanvas()
  const ctx = canvas.getContext("2d")
  const state = JSON.parse(initialState)
  let frames = 0
  initPeer()
  const inputsByFrame = {}
  const statesByFrame = {}
  const debug = {savedState: initialState}

  const currentInputs = new Set()
  window.addEventListener('keydown', function (e) {
    currentInputs.add(e.code)
  })
  window.addEventListener('keyup', function (e) {
    currentInputs.delete(e.code)
  })

  function main() {
    let stopMain = window.requestAnimationFrame(main)
    inputsByFrame[frames + FRAME_DELAY] = new Set(currentInputs)
    networkSendInputs(inputsByFrame)
    const inputs = inputsByFrame[frames] || new Set()
    update(state, inputs)
    statesByFrame[frames] = JSON.stringify(state)
    render(state, ctx, canvas)
    frames++
    delete inputsByFrame[frames - 10]
    delete statesByFrame[frames - 10]
  }

  main()
  addDebug(state, debug)
  test1()
  test2()
})()

if (module.hot) {
  module.hot.accept('./main.js', function () {
    console.log('Accepting the updated main module!')
  })
}
