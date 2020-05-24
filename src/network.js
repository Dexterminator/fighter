import Peer from "peerjs"

export function getRemoteInputs() {

}

export function networkSendInputs(inputsByFrame) {

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
