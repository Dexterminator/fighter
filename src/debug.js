import {render, update, mainConstants, initCanvas, addTitle} from "./main"

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
  const frameDuration = 50
  const player1InputsByFrame = {}
  const player2InputsByFrame = {}
  for (let i = 0; i < frameDuration / 2; i++) {
    player1InputsByFrame[i] = new Set(['right'])
    player2InputsByFrame[i] = new Set(['left'])
  }
  const state = JSON.parse(mainConstants.initialState)
  testScenario(state, player1InputsByFrame, player2InputsByFrame, frameDuration, 'Test 1')
}

export function test2() {
  const frameDuration = 120
  const inputsByFrame = {
    0: new Set(['a']),
    60: new Set(['down', 'a'])
  }
  const state = JSON.parse(mainConstants.initialState)
  state.player2.x = 430
  testScenario(state, inputsByFrame, {}, frameDuration, 'Test 2')
}

export function test3() {
  const frameDuration = 120
  const inputsByFrame = {
    0: new Set(['a']),
    60: new Set(['down', 'a'])
  }
  const state = JSON.parse(mainConstants.initialState)
  state.player2.x = 480
  testScenario(state, inputsByFrame, {}, frameDuration, 'Test 3')
}

if (module.hot) {
  module.hot.accept('./main.js', function () {
    console.log('Debug: Accepting the updated main module!')
  })
}
