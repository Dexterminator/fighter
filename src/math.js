export function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

export function getLeftX(object) {
  return object.x - 0.5 * object.width
}

export function getTopY(object) {
  return object.y - 0.5 * object.height
}

export function isOverlapping(rect1, rect2) {
  return getLeftX(rect1) < getLeftX(rect2) + rect2.width &&
    getLeftX(rect1) + rect1.width > getLeftX(rect2) &&
    getTopY(rect1) < getTopY(rect2) + rect2.height &&
    getTopY(rect1) + rect1.height > getTopY(rect2)
}
