import Peer from "peerjs"
import {MAX_PREDICTION_WINDOW} from "./constants"

export function parseRemoteInput(remoteInput) {
  return JSON.parse(remoteInput, (key, value) => value instanceof Array ? new Set(value): value)
}

export function encodeInput(input) {
  return JSON.stringify(input, (key, value) => value instanceof Set ? [...value] : value)
}

export function resolveNetworking(simulatedFrames, remoteInputByFrame, statesByFrame, currentFrame) {
  remoteInputByFrame = parseRemoteInput(remoteInputByFrame)
  const simulated = new Set()
  for (let i = Math.min(0, currentFrame - MAX_PREDICTION_WINDOW); i < currentFrame; i++) {
    if (!remoteInputByFrame.hasOwnProperty(i)) {
      simulated.add(i)
    }
  }
}

export function networkSendInputs(inputsByFrame) {
  const json = encodeInput(inputsByFrame)
}

export function initPeer() {
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
