import {renderState} from "./render"
import {updateState} from "./update"
import {FRAME_DELAY, initialState, inputsByKey, inputsByKey2} from "./constants"
import * as debug from "./debug"
import * as dom from "./dom"
import * as network from "./network"

export function render(state, ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  renderState(ctx, state)
}

export function update(state, player1Inputs = new Set(), player2Inputs = new Set()) {
  updateState(state, player1Inputs, player2Inputs)
}

export const mainConstants = {
  FRAME_DELAY: FRAME_DELAY,
  initialState: initialState,
  inputsByKey: inputsByKey,
  inputsByKey2: inputsByKey2
}

export function addDebug(state, debugConfig) {
  // debug.addDebug(state, debugConfig)
  // debug.test1()
  // debug.test2()
  // debug.test3()
}

export function initCanvas() {
  return dom.initCanvas()
}

export function addTitle() {
  return dom.addTitle()
}

export function initPeer() {
  network.initPeer()
}

export function networkSendInputs(inputsByFrame) {
  network.networkSendInputs(inputsByFrame)
}