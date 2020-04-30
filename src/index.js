import "./styles.css"
import {GAME_HEIGHT, GAME_WIDTH, render, update} from "./main"
import Peer from "peerjs"

const initialState = {
  x: 5,
  y: 50,
  width: 80,
  height: 80,
}

function initCanvas() {
  const canvas = document.createElement("canvas")
  document.body.insertBefore(canvas, document.body.childNodes[0])
  canvas.width = GAME_WIDTH
  canvas.height = GAME_HEIGHT
  return canvas
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

(function () {
  const canvas = initCanvas()
  const ctx = canvas.getContext("2d")
  const state = initialState
  initPeer()

  function main() {
    let stopMain = window.requestAnimationFrame(main)
    update(state)
    render(state, ctx, canvas)
  }

  main()
})()

if (module.hot) {
  module.hot.accept('./main.js', function () {
    console.log('Accepting the updated main module!')
  })
}
