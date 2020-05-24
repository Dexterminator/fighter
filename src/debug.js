import {render, update, mainConstants, initCanvas, addTitle} from "./main"
import {encodeInput, resolveNetworking} from "./network"

export function addDebug(state, debug) {
  const button = document.createElement("button")
  document.body.append(button)
  button.innerHTML = 'Log state'
  button.onclick = () => {
    console.log(state)
    console.log(JSON.stringify(state))
  }

  const button2 = document.createElement("button")
  document.body.append(button2)
  button2.innerHTML = 'Save state'
  button2.onclick = () => debug.savedState = JSON.stringify(state)

  const button3 = document.createElement("button")
  document.body.append(button3)
  button3.innerHTML = 'Restore state'
  button3.onclick = () => Object.assign(state, JSON.parse(debug.savedState))
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function networkTestScenario(initialState, player1InputsByFrame, remoteInputsByFrameByFrame, frameDuration, title) {
  const h1 = addTitle()
  const h12 = addTitle()
  const h13 = addTitle()
  const canvas = initCanvas()
  const ctx = canvas.getContext("2d")
  initialState = JSON.stringify(initialState)
  let state = JSON.parse(initialState)
  let frames = 0

  let statesByFrame = {'-1': initialState}
  let networkState = {latestSyncedFrame: -1}

  let remoteInput = JSON.stringify({})

  function main() {
    // Simulate receiving new input from network
    if (remoteInputsByFrameByFrame.hasOwnProperty(frames)) {
      remoteInput = remoteInputsByFrameByFrame[frames]
    }
    let [newLatestSyncedFrame, newInputsByFrame, newState] = resolveNetworking(player1InputsByFrame, remoteInput, statesByFrame, networkState.latestSyncedFrame, frames)
    h1.innerHTML = title + ', frame: ' + frames
    h12.innerHTML = 'Player 1 input: [' + Array.from(player1InputsByFrame[frames] || []) + ']'
    h13.innerHTML =  'Predicting player 2 input: [' + Array.from(newInputsByFrame[frames]) + ']' + (remoteInputsByFrameByFrame.hasOwnProperty(frames) ? ' Update!' : '')
    state = newState
    networkState.latestSyncedFrame = newLatestSyncedFrame
    update(state, player1InputsByFrame[frames], newInputsByFrame[frames])
    render(state, ctx, canvas)
    frames++
    if (frames % frameDuration === 0) {
      frames = 0
      state = JSON.parse(initialState)
      remoteInput = JSON.stringify({})
      networkState = {latestSyncedFrame: -1}
    }
  }

  function executeFrame() {
    main()
    setTimeout(executeFrame, 2000)
  }

  executeFrame()
}

export function test4() {
  const frameDuration = 20
  const inputsByFrame = {
    0: new Set(['right']),
    1: new Set(['right']),
    2: new Set(['right']),
    3: new Set(['right']),
    4: new Set(['attack']),
  }

  const remoteInputsByFrameByFrame = {
    4: encodeInput({
      0: new Set(['left']),
      1: new Set(['left']),
      2: new Set(['left']),
      3: new Set(['left']),
    }),
    10: encodeInput({
      0: new Set(['left']),
      1: new Set(['left']),
      2: new Set(['left']),
      3: new Set(['left']),
      4: new Set(['attack']),
    })
  }

  const state = JSON.parse(mainConstants.initialState)
  networkTestScenario(state, inputsByFrame, remoteInputsByFrameByFrame, frameDuration, 'Rollback test')
}

function testScenario(initialState, player1InputsByFrame, player2InputsByFrame, frameDuration, title) {
  const h1 = addTitle()
  const canvas = initCanvas()
  const ctx = canvas.getContext("2d")
  initialState = JSON.stringify(initialState)
  let state = JSON.parse(initialState)

  let frames = 0

  function main() {
    let stopMain = window.requestAnimationFrame(main)
    h1.innerHTML = title + ', progress: ' + Math.round(frames / frameDuration * 100) + '%'
    update(state, player1InputsByFrame[frames], player2InputsByFrame[frames])
    render(state, ctx, canvas)
    frames++
    if (frames % frameDuration === 0) {
      frames = 0
      state = JSON.parse(initialState)
    }
  }

  main()
}

export function test1() {
  const frameDuration = 120
  const player1InputsByFrame = {}
  const player2InputsByFrame = {}

  for (let i = 0; i < frameDuration; i++) {
    player1InputsByFrame[i] = new Set(['attack'])
  }

  for (let i = 0; i < frameDuration; i++) {
    player2InputsByFrame[i] = new Set(['down'])
  }

  player2InputsByFrame['10'] = new Set(['attack', 'down'])
  const state = JSON.parse(mainConstants.initialState)
  state.player2.x = 400
  testScenario(state, player1InputsByFrame, player2InputsByFrame, frameDuration, 'Test 1')
}

export function test2() {
  const frameDuration = 240
  const player1InputsByFrame = {
    0: new Set(['attack']),
    60: new Set(['down', 'attack']),
    120: new Set(['attack']),
    180: new Set(['down', 'attack']),
  }

  const player2InputsByFrame = {}
  for (let i = 0; i < 60; i++) {
    player2InputsByFrame[i] = new Set(['block'])
  }

  for (let i = 60; i < 120; i++) {
    player2InputsByFrame[i] = new Set(['block', 'down'])
  }

  const state = JSON.parse(mainConstants.initialState)
  state.player2.x = 400
  testScenario(state, player1InputsByFrame, player2InputsByFrame, frameDuration, 'Test 2')
}

export function test3() {
  const frameDuration = 120
  const inputsByFrame = {
    0: new Set(['attack']),
    60: new Set(['down', 'attack'])
  }
  const player2InputsByFrame = {}
  for (let i = 0; i < frameDuration; i++) {
    player2InputsByFrame[i] = new Set(['down'])
  }
  const state = JSON.parse(mainConstants.initialState)
  state.player2.x = 400
  testScenario(state, inputsByFrame, player2InputsByFrame, frameDuration, 'Test 3')
}

if (module.hot) {
  module.hot.accept('./main.js', function () {
    console.log('Debug: Accepting the updated main module!')
  })
}
