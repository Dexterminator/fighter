import {easeInOutCubic} from "./main"

test('easing should work', () => {
  expect(easeInOutCubic(0.85)).toBe(0.986)
})
