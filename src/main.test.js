import {easeInOutCubic, isOverlapping} from "./math"
import {encodeInput, parseRemoteInput} from "./network"

test('easing should work', () => {
  expect(easeInOutCubic(0.85)).toBe(0.9865)
})

function createRect(x, y, width, height) {
  return {
    x: x,
    y: y,
    width: width,
    height: height,
  }
}

test('collision checks', () => {
  expect(isOverlapping(createRect(10, 10 , 10, 10), createRect(10, 10, 10, 10))).toBeTruthy()
  expect(isOverlapping(createRect(10, 10 , 10, 10), createRect(15, 10, 10, 10))).toBeTruthy()
  expect(isOverlapping(createRect(10, 10 , 10, 10), createRect(10, 15, 10, 10))).toBeTruthy()
  expect(isOverlapping(createRect(10, 10 , 10, 10), createRect(15, 15, 10, 10))).toBeTruthy()
  expect(isOverlapping(createRect(10, 10 , 10, 10), createRect(20, 10, 10, 10))).toBeFalsy()
  expect(isOverlapping(createRect(10, 10 , 10, 10), createRect(10, 20, 10, 10))).toBeFalsy()
})

test('remote input parsing', () => {
  const remoteInput = {
    0: new Set(['right', 'a']),
    1: new Set(),
    2: new Set(['left'])
  }
  const encodedInput = encodeInput(remoteInput)

  expect(encodedInput).toBe("{\"0\":[\"right\",\"a\"],\"1\":[],\"2\":[\"left\"]}")
  expect(parseRemoteInput(encodedInput)).toStrictEqual(remoteInput)
})
