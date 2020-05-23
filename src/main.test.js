import {easeInOutCubic, isOverlapping} from "./math"

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
