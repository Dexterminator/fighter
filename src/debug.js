import {addTitle, initCanvas} from "./dom"
import {render, update} from "./main"
import {initialState} from "./constants"

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
  addTitle(title)
  const canvas = initCanvas()
  const ctx = canvas.getContext("2d")
  let state = JSON.parse(initialState)

  let frames = 0

  function main() {
    let stopMain = window.requestAnimationFrame(main)
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
  for (let i = 0; i < frameDuration; i++) {
    player1InputsByFrame[i] = new Set(["right"])
    player2InputsByFrame[i] = new Set(["left"])
  }
  testScenario(initialState, player1InputsByFrame, player2InputsByFrame, frameDuration, 'Test 1')
}

export function test2() {
  const frameDuration = 120
  const inputsByFrame = {}
  for (let i = 0; i < frameDuration; i++) {
    inputsByFrame[i] = new Set(["right"])
  }
  testScenario(initialState, inputsByFrame, {}, frameDuration, 'Test 2')
}

if (module.hot) {
  module.hot.accept('./main.js', function () {
    console.log('Accepting the updated main module!')
  })
}
