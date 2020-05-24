import SimplePeer from "simple-peer"
import {MAX_PREDICTION_WINDOW} from "./constants"
import {update} from "./main"

export function parseRemoteInput(remoteInput) {
  return JSON.parse(remoteInput, (key, value) => value instanceof Array ? new Set(value) : value)
}

export function encodeInput(input) {
  return JSON.stringify(input, (key, value) => value instanceof Set ? [...value] : value)
}

export function resolveNetworking(inputsByFrame, remoteInputsByFrame, statesByFrame, latestSyncedFrame, currentFrame) {
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

  const state = JSON.parse(statesByFrame[latestSyncedFrame])
  for (let i = latestSyncedFrame + 1; i < currentFrame; i++) {
    update(state, inputsByFrame[i], remoteInputsByFrame[i])
    statesByFrame[i] = JSON.stringify(state)
  }

  delete remoteInputsByFrame[-1]
  return [newLatestSyncedFrame, remoteInputsByFrame, state]
}

export function networkSendInputs(inputsByFrame) {
  const json = encodeInput(inputsByFrame)
}

export function initHostPeer() {
  const p = new SimplePeer({
    initiator: true,
    trickle: false
  })
  p.on('error', err => console.log('error', err))

  p.on('signal', data => {
    console.log('SIGNAL', JSON.stringify(data))
    const div = document.createElement('div')
    const div2 = document.createElement('div')
    div.textContent = "Paste the below in the guest's form!"
    div2.textContent = JSON.stringify(data)
    div2.style = 'color: teal'
    document.body.append(div)
    document.body.append(div2)

    const div3 = document.createElement('div')
    div3.textContent = "Paste the guest's response here."

    document.body.append(document.createElement('br'))
    document.body.append(div3)
    const textArea = document.createElement('textarea')
    document.body.append(textArea)
    const button = document.createElement("button")
    button.textContent = 'Start game!'
    button.onclick = () => {
      p.signal(JSON.parse(textArea.value))
    }
    document.body.append(button)
  })

  p.on('connect', () => {
    console.log('CONNECTED TO GUEST')
    p.send('whatever' + Math.random())
  })

  p.on('data', data => {
    console.log('data: ' + data)
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

  p.on('signal', data => {
    console.log('SIGNAL', JSON.stringify(data))
    const div = document.createElement('div')
    const div2 = document.createElement('div')
    div.textContent = "Paste this in the host's form!"
    div2.textContent = JSON.stringify(data)
    div2.style = 'color: teal'
    document.body.append(div)
    document.body.append(document.createElement('br'))
    document.body.append(div2)
  })

  p.on('connect', () => {
    console.log('CONNECTED TO HOST')
    p.send('whatever' + Math.random())
  })

  p.on('data', data => {
    console.log('data: ' + data)
  })
}

export function testPeer() {
  const p = new SimplePeer({
    initiator: location.hash === '#host',
    trickle: false
  })

  const textArea = document.createElement('textarea')
  document.body.append(textArea)

  document.querySelector('form').addEventListener('submit', ev => {
    ev.preventDefault()
    p.signal(JSON.parse(document.querySelector('#incoming').value))
  })

  p.on('connect', () => {
    console.log('CONNECT')
    p.send('whatever' + Math.random())
  })

  p.on('data', data => {
    console.log('data: ' + data)
  })
}
