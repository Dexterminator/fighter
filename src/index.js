import "./styles.css"
import {GAME_HEIGHT, GAME_WIDTH, render, update} from "./main"
import Peer from "peerjs"

const FRAME_DELAY = 3

const initialState = JSON.stringify({
  x: 5,
  y: 50,
  width: 80,
  height: 80,
  progress: 0,
})

function initCanvas() {
  const canvas = document.createElement("canvas")
  document.body.append(canvas)
  canvas.width = GAME_WIDTH
  canvas.height = GAME_HEIGHT
  return canvas
}

function addDebug(state, debug) {
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

function addTitle(text) {
  const h1 = document.createElement("h1")
  document.body.append(h1)
  h1.innerHTML = text
  return h1
}

function initPeer() {
  const peer = new Peer()
  peer.on('open', id => {
    let remotePeerId = document.location.href.substring(document.location.href.lastIndexOf('/') + 1)
    if (remotePeerId !== '') {
      console.log('attempting to connect to ' + remotePeerId)
      const conn = peer.connect(remotePeerId)
      conn.on('open', () => {
        conn.send('hi from ' + id)
        console.log('sent message to ' + remotePeerId)
      })
    } else {
      const div = document.createElement('div')
      div.innerHTML = 'Connect url: ' + document.location.href + '/#/' + id
      document.body.append(div)
    }
  })

  peer.on('connection', (conn) => {
    conn.on('data', (data) => {
      console.log(data)
    })

    conn.on('open', () => {
      console.log('Connection established!')
      conn.send('hello!')
    })
  })
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

function networkSendInputs(inputsByFrame) {

}

function test1() {
  const frameDuration = 60
  const inputsByFrame = {}
  for (let i = 0; i < frameDuration; i++) {
    inputsByFrame[i] = new Set(["KeyD"])
  }
  testScenario(initialState, inputsByFrame, frameDuration, 'Test 1')
}

function test2() {
  const frameDuration = 120
  const inputsByFrame = {}
  for (let i = 0; i < frameDuration; i++) {
    inputsByFrame[i] = new Set(["KeyD"])
  }
  testScenario(initialState, inputsByFrame, frameDuration, 'Test 2')
}

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
