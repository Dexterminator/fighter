import Peer from "peerjs"
import {MAX_PREDICTION_WINDOW} from "./constants"
import {update} from "./main"

export function parseRemoteInput(remoteInput) {
  return JSON.parse(remoteInput, (key, value) => value instanceof Array ? new Set(value) : value)
}

export function encodeInput(input) {
  return JSON.stringify(input, (key, value) => value instanceof Set ? [...value] : value)
}

export function resolveNetworking(inputsByFrame, remoteInputsByFrame, statesByFrame, latestSyncedFrame, currentFrame) {
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
