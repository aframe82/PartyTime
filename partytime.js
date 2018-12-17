/**
 * PartyTime.js
 * There's a party at Intercom. All customers within 100km are invited. 
 * Bring your party shirts.
 */

/**
 * CONSTANTS 
 */
const RADIUS_KM = 6371 // Earth Radius
const MAX_DISTANCE = 100 // Max distance in KM of invitees
const dubsOffice = { // Dublin Office coords
  latitude: 53.339428,
  longitude: -6.257664
}

/**
* Step 1 - The invitees
* Read a file that has the customer name, id, and lat/lng pairs.
* (downloaded locally for brevity)
*/
const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const fs = require('fs')
    const readline = require('readline')

    // Does the file exist (relative to project dir)
    const fileExists = fs.existsSync(file)
    if (!fileExists) {
      throw 'File does not exist. No parties without people! Aborting.'
    }

    const fileStream = fs.createReadStream(file)
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity })

    let lines = []
    rl.on('line', line => {
      // read a line at a time of the file (so we can construct a JSON object later)
      lines.push(JSON.parse(line))
    })

    rl.on('close', () => {
      // return the promise when we've done with the file read
      return resolve(lines)
    })

    rl.on('error', error => {
      // crash and burn if we hit an error reading the file
      return reject(error)
    })
  })
}

const _degressToRadian = (degrees) => {
  return (degrees * Math.PI / 180.0)
}

/**
 * Return the distance in KM of the lat/lng pairs
 * @param {Number} _lat1 
 * @param {Number} _lng1 
 * @param {Number} _lat2 
 * @param {Number} _lng2 
 */
const distanceInKilometres = (_lat1, _lng1, _lat2, _lng2) => {
  const lat1 = _degressToRadian(_lat1)
  const lng1 = _degressToRadian(_lng1)
  const lat2 = _degressToRadian(_lat2)
  const lng2 = _degressToRadian(_lng2)

  const diffLat = lat2 - lat1
  const diffLng = lng2 - lng1

  const a = Math.pow(Math.sin(diffLat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.pow(Math.sin(diffLng / 2), 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return RADIUS_KM * c
}

/**
 * Return an Array of entries with distances in km
 * @param {Object} contents 
 */
const mapContentsToEntriesWithDistance = (contents) => {
  // quick type check
  if (!contents instanceof Array) {
    return Promise.reject('mapContents.. not received an array')
  }
  // convert distances and add distance in km to each customer entry
  contents.map(entry => entry.distance_km = distanceInKilometres(entry.latitude, entry.longitude, dubsOffice.latitude, dubsOffice.longitude))
  return Promise.resolve(contents)
}

/**
 * Return an Array of entries that do not exceed the max distance
 * @param {Number} maxDistance 
 * @param {Array} distances 
 */
const distancesLessThanKm = (maxDistance, distances) => {
  if (maxDistance < 1) {
    return Promise.reject('Max distance must be greater than 0')
  }

  const filteredDistances = distances.filter(distance => distance.distance_km <= maxDistance)
  return Promise.resolve(filteredDistances)
}

// Read the file from the project dir
readFile('./customers.txt')
  .then(contents => {
    // Make sure it's the right kind of object before moving forward
    if (typeof contents !== 'object') {
      return Promise.reject('Not an object')
    }

    return Promise.resolve(contents)
  })
  // send this object to have it's distances calculated
  .then(contents => mapContentsToEntriesWithDistance(contents))
  // grab the distances that we want
  .then(entries => distancesLessThanKm(MAX_DISTANCE, entries))
  // return the party people
  .then(closeEntries => {
    let partyList = closeEntries.sort((a, b) => a.user_id - b.user_id).map(customer => {
      return {
        userId: customer.user_id,
        customerName: customer.name,
        distance: customer.distance_km,
        distanceString: `${customer.distance_km.toFixed(1)} KM`
      }
    })
    // show some magic
    console.log(partyList)
  })
  .catch(err => {
    throw err
  })

module.exports = {
  _degressToRadian,
  distanceInKilometres,
  mapContentsToEntriesWithDistance,
  distancesLessThanKm,
readFile}
