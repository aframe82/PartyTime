const fs = require('fs')
const partytime = require('./partytime')

test('Customers file exists', () => {
  expect(fs.existsSync('./customers.txt')).toBeTruthy()
})

test('Imported file has correct properties for each entry', async () => {
  let entries = await partytime.readFile('./customers.txt')
  entries.forEach(entry => {
    expect(entry).toHaveProperty('latitude')
    expect(entry).toHaveProperty('longitude')
    expect(entry).toHaveProperty('user_id')
    expect(entry).toHaveProperty('name')
  })
})

test('_degreesToRadian returns ~0.01745329252 for 1 degree', () => {
  expect(partytime._degressToRadian(1)).toBeCloseTo(0.01745329252)
})

test('distanceInKilometres is zero for same place', () => {
  expect(partytime.distanceInKilometres(53.339428, -6.257664, 53.339428, -6.257664)).toBe(0)
})

test('mapContentsToEntriesWithDistance returns correct distance', async () => {
  let entries = [{"latitude": "52.986375", "user_id": 12, "name": "Christina McArdle", "longitude": "-6.043701"}]
  let mappedContents = await partytime.mapContentsToEntriesWithDistance(entries)
  expect(mappedContents[0]).toHaveProperty('distance_km')
  expect(mappedContents[0].distance_km).toBeCloseTo(41.768725500836844)
})

test('distancesLessThanKm rejects if max distance is 0', async () => {
  expect.assertions(1)
  expect(partytime.distancesLessThanKm(0, [])).rejects.toEqual("Max distance must be greater than 0")
})
