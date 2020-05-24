import {easeInOutCubic, isOverlapping} from "./math"
import {encodeInput, parseRemoteInput, resolveNetworking} from "./network"
import {initialState, playerStates} from "./constants"
import {update} from "./main"

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
  expect(isOverlapping(createRect(10, 10, 10, 10), createRect(10, 10, 10, 10))).toBeTruthy()
  expect(isOverlapping(createRect(10, 10, 10, 10), createRect(15, 10, 10, 10))).toBeTruthy()
  expect(isOverlapping(createRect(10, 10, 10, 10), createRect(10, 15, 10, 10))).toBeTruthy()
  expect(isOverlapping(createRect(10, 10, 10, 10), createRect(15, 15, 10, 10))).toBeTruthy()
  expect(isOverlapping(createRect(10, 10, 10, 10), createRect(20, 10, 10, 10))).toBeFalsy()
  expect(isOverlapping(createRect(10, 10, 10, 10), createRect(10, 20, 10, 10))).toBeFalsy()
})

test('remote input parsing', () => {
  const remoteInput = {
    0: new Set(['right', 'attack']),
    1: new Set(),
    2: new Set(['left'])
  }
  const encodedInput = encodeInput(remoteInput)

  expect(encodedInput).toBe("{\"0\":[\"right\",\"attack\"],\"1\":[],\"2\":[\"left\"]}")
  expect(parseRemoteInput(encodedInput)).toStrictEqual(remoteInput)
})

function getOwnInputsByFrame(frames) {
  const ownInputsByFrame = {}
  for (let i = 0; i < frames; i++) {
    ownInputsByFrame[i] = new Set()
  }
  return ownInputsByFrame
}

function getStatesByFrame(frames) {
  const statesByFrame = {}
  for (let i = -1; i < frames; i++) {
    statesByFrame[i] = initialState
  }
  return statesByFrame
}

test('network resolving base case', () => {
  const currentFrame = 0
  const remoteInput = encodeInput({})
  expect(resolveNetworking(getOwnInputsByFrame(currentFrame), remoteInput, getStatesByFrame(currentFrame), -1, currentFrame)).toStrictEqual(
    [-1, {0: new Set()}, JSON.parse(initialState)])
})

test('Opponent input first arrives on frame 3, same as current frame', () => {
  const currentFrame = 3
  const input = {}
  for (let i = 0; i <= 3; i++) {
    input[i] = new Set()
  }

  const remoteInput = encodeInput(input)
  const [newLatestSyncedFrame, newInputsByFrame, newState] = resolveNetworking(getOwnInputsByFrame(currentFrame), remoteInput, getStatesByFrame(currentFrame), -1, currentFrame)
  expect(newLatestSyncedFrame).toBe(3)
  expect(newInputsByFrame).toStrictEqual(input)
  expect(newState.player1Inputs).toStrictEqual(Object.values(getOwnInputsByFrame(currentFrame)).map(_ => []))
  expect(newState.player2Inputs).toStrictEqual([
    [],
    [],
    [],
  ])
})

test('Opponent input first arrives on frame 3, and current frame is 5', () => {
  const currentFrame = 5
  const input = {
    0: new Set(['left']),
    1: new Set(['left']),
    2: new Set(['right']),
    3: new Set(['down']),
  }

  const remoteInput = encodeInput(input)

  const expectedPredictedInput = {}
  Object.assign(expectedPredictedInput, input)
  Object.assign(expectedPredictedInput, {
    4: new Set(['down']),
    5: new Set(['down'])
  })

  const [newLatestSyncedFrame, newInputsByFrame, newState] = resolveNetworking(getOwnInputsByFrame(currentFrame), remoteInput, getStatesByFrame(currentFrame), -1, currentFrame)
  expect(newLatestSyncedFrame).toBe(3)
  expect(newInputsByFrame).toStrictEqual(expectedPredictedInput)
  expect(newState.player1Inputs).toStrictEqual(Object.values(getOwnInputsByFrame(currentFrame)).map(_ => []))
  expect(newState.player2Inputs).toStrictEqual([
    ['left'],
    ['left'],
    ['right'],
    ['down'],
    ['down'],
  ])
})

test('Advanced networking scenario', () => {
  let currentFrame = 5
  const input = {
    0: new Set(['left']),
    1: new Set(['left']),
    2: new Set(['right']),
    3: new Set(['down']),
  }
  const remoteInput = encodeInput(input)

  let statesByFrame = getStatesByFrame(currentFrame)
  let [newLatestSyncedFrame, newInputsByFrame, newState] = resolveNetworking(getOwnInputsByFrame(currentFrame), remoteInput, statesByFrame, -1, currentFrame)
  update(newState, new Set(), newInputsByFrame[currentFrame])
  statesByFrame[currentFrame] = JSON.stringify(newState)
  expect(newLatestSyncedFrame).toBe(3)
  expect(newState.player2Inputs).toStrictEqual([
    ['left'],
    ['left'],
    ['right'],
    ['down'],
    ['down'],
    ['down'],
  ])
  expect(newState.player2.state).toBe(playerStates.CROUCHING)
  const currentFrame2 = currentFrame + 1

  const input2 = {
    0: new Set(['left']),
    1: new Set(['left']),
    2: new Set(['right']),
    3: new Set(['down']),
    4: new Set(['attack']),
  }

  const remoteInput2 = encodeInput(input2)

  const expectedPredictedInput = {}
  Object.assign(expectedPredictedInput, input2)
  Object.assign(expectedPredictedInput, {
    5: new Set(['attack']),
    6: new Set(['attack'])
  })

  let [newLatestSyncedFrame2, newInputsByFrame2, newState2] = resolveNetworking(
    getOwnInputsByFrame(currentFrame2),
    remoteInput2,
    statesByFrame,
    newLatestSyncedFrame,
    currentFrame2)

  expect(newLatestSyncedFrame2).toBe(4)
  expect(newInputsByFrame2).toStrictEqual(expectedPredictedInput)
  expect(newState2.player2Inputs).toStrictEqual([
    ['left'],
    ['left'],
    ['right'],
    ['down'],
    ['attack'], // Latest received
    ['attack'], // Predicted
  ])
  expect(newState2.player2.state).toBe(playerStates.PUNCHING)
})
