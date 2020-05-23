import {GAME_HEIGHT, GAME_WIDTH} from "./main"

export function initCanvas() {
  const canvas = document.createElement("canvas")
  document.body.append(canvas)
  canvas.width = GAME_WIDTH
  canvas.height = GAME_HEIGHT
  return canvas
}

export function addTitle(text) {
  const h1 = document.createElement("h1")
  document.body.append(h1)
  h1.innerHTML = text
  return h1
}
