const fs = require('fs')
const partytime = require('./partytime')

test('Customers file exists', () => {
  expect(fs.existsSync('./customers.txt')).toBeTruthy()
})

test('_degreesToRadian returns ~0.01745329252 for 1 degree', () => {
  expect(partytime._degressToRadian(1)).toBeCloseTo(0.01745329252)
})

test('distanceInKilometres Returns a number', () => {
  expect(partytime.distanceInKilometres(1, 1, 1, 1)).toBe(100)
})
