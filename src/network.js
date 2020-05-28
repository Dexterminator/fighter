import SimplePeer from "simple-peer"
import {MAX_PREDICTION_WINDOW} from "./constants"
import {update} from "./main"
import {startGame} from "./index"

export function parseRemoteInput(remoteInput) {
  // TODO: This can fail with Uncaught SyntaxError: Unexpected token o in JSON at position 1
  return JSON.parse(remoteInput, (key, value) => value instanceof Array ? new Set(value) : value)
}

export function encodeInput(input) {
  return JSON.stringify(input, (key, value) => value instanceof Set ? [...value] : value)
}

export function resolveNetworking(inputsByFrame, remoteInputsByFrame, statesByFrame, latestSyncedFrame, currentFrame, playerId) {
  remoteInputsByFrame = remoteInputsByFrame || JSON.stringify({})
  remoteInputsByFrame = parseRemoteInput(remoteInputsByFrame)
  remoteInputsByFrame[-1] = new Set()
  let newLatestSyncedFrame = latestSyncedFrame
  for (let i = latestSyncedFrame + 1; i <= currentFrame; i++) {
    if (remoteInputsByFrame.hasOwnProperty(i)) {
      newLatestSyncedFrame = i
    } else {
      // Assume input was the same as the frame before
      remoteInputsByFrame[i] = remoteInputsByFrame[i - 1]
    }
  }

  // TODO: This can be undefined when rift is too big
  const state = JSON.parse(statesByFrame[latestSyncedFrame])
  for (let i = latestSyncedFrame + 1; i < currentFrame; i++) {
    // TODO: Do this in a nicer way somehow
    if (playerId === 'player1') {
      update(state, inputsByFrame[i], remoteInputsByFrame[i])
    } else {
      update(state, remoteInputsByFrame[i], inputsByFrame[i])
    }
    statesByFrame[i] = JSON.stringify(state)
  }

  delete remoteInputsByFrame[-1]
  return [newLatestSyncedFrame, remoteInputsByFrame, state]
}

export function networkSendInputs(inputsByFrame) {
  const json = encodeInput(inputsByFrame)
}

function appendControls() {
  const div1 = document.createElement('div')
  const div2 = document.createElement('div')
  div1.textContent = 'Controls:'
  div2.textContent = 'Left: A, Right: D, Crouch: S, Punch: C, Block: V'
  document.body.append(div1)
  document.body.append(div2)
}

export function initHostPeer() {
  const p = new SimplePeer({
    initiator: true,
    trickle: false
  })
  p.on('error', err => console.log('error', err))

  const div = document.createElement('div')
  const div2 = document.createElement('div')
  const div3 = document.createElement('div')
  const textArea = document.createElement('textarea')
  const button = document.createElement("button")
  p.on('signal', data => {
    div.textContent = "Paste the below in the guest's form!"
    div2.textContent = JSON.stringify(data)
    div2.style = 'color: teal'
    document.body.append(div)
    document.body.append(div2)

    div3.textContent = "Paste the guest's response here."

    document.body.append(document.createElement('br'))
    document.body.append(div3)
    document.body.append(textArea)
    button.textContent = 'Start game!'
    button.onclick = () => {
      p.signal(JSON.parse(textArea.value))
    }
    document.body.append(button)
  })

  p.on('connect', () => {
    console.log('CONNECTED TO GUEST')
    p.send('whatever' + Math.random())
    div.remove()
    div2.remove()
    div3.remove()
    textArea.remove()
    button.remove()
    appendControls()
    startGame(p, 'player1')
  })
}

export function initGuestPeer() {
  const p = new SimplePeer({
    trickle: false
  })

  p.on('error', err => console.log('error', err))

  const div = document.createElement('div')
  div.textContent = "Paste the weird scary text from the host here."
  document.body.append(div)
  const textArea = document.createElement('textarea')
  document.body.append(textArea)
  const button = document.createElement("button")
  button.textContent = 'Get response'
  button.onclick = () => {
    p.signal(JSON.parse(textArea.value))
  }
  document.body.append(button)

  const div2 = document.createElement('div')
  const div3 = document.createElement('div')

  p.on('signal', data => {
    div2.textContent = "Paste this in the host's form!"
    div3.textContent = JSON.stringify(data)
    div3.style = 'color: teal'
    document.body.append(div2)
    document.body.append(document.createElement('br'))
    document.body.append(div3)
  })

  p.on('connect', () => {
    console.log('CONNECTED TO HOST')
    p.send('whatever' + Math.random())
    div.remove()
    div2.remove()
    div3.remove()
    textArea.remove()
    button.remove()
    appendControls()
    startGame(p, 'player2')
  })
}
