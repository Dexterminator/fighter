import {easeInOutCubic} from "./math"

test('easing should work', () => {
  expect(easeInOutCubic(0.85)).toBe(0.986)
})
