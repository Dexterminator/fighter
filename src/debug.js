import {initialState} from "./constants"
import {addTitle, initCanvas} from "./dom"
import {render, update} from "./main"

export function addDebug(state, debug) {
  const button = document.createElement("button")
  document.body.append(button)
  button.innerHTML = 'Log state'
  button.onclick = () => console.log(JSON.stringify(state))

  const button2 = document.createElement("button")
  document.body.append(button2)
  button2.innerHTML = 'Save state'
  button2.onclick = () => debug.savedState = JSON.stringify(state)

  const button3 = document.createElement("button")
  document.body.append(button3)
  button3.innerHTML = 'Restore state'
  button3.onclick = () => Object.assign(state, JSON.parse(debug.savedState))
}

function testScenario(initialState, inputsByFrame, frameDuration, title) {
  addTitle(title)
  const canvas = initCanvas()
  const ctx = canvas.getContext("2d")
  let state = JSON.parse(initialState)

  let frames = 0

  function main() {
    let stopMain = window.requestAnimationFrame(main)
    update(state, inputsByFrame[frames])
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
  const frameDuration = 60
  const inputsByFrame = {}
  for (let i = 0; i < frameDuration; i++) {
    inputsByFrame[i] = new Set(["KeyD"])
  }
  testScenario(initialState, inputsByFrame, frameDuration, 'Test 1')
}

export function test2() {
  const frameDuration = 120
  const inputsByFrame = {}
  for (let i = 0; i < frameDuration; i++) {
    inputsByFrame[i] = new Set(["KeyD"])
  }
  testScenario(initialState, inputsByFrame, frameDuration, 'Test 2')
}
