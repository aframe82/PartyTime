/**
 * PartyTime.js
 * There's a party at Intercom. All customers within 100km are invited. 
 * Bring your party shirts.
 */

/**
* Step 1 - The invitees
* Read a file that has the customer name, id, and lat/lng pairs.
* (downloaded locally for brevity)
*/
const readFile = async (file) => {
  const fs = require('fs')

  // Does the file exist (relative to project dir)
  const fileExists = fs.existsSync(file)
  if (!fileExists) {
    throw "File does not exist. No parties without people! Aborting."
  }

  // Let this function return a Promise
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        return reject(err)
      }
      // Turn the Buffer data into a string
      resolve(data.toString())
    })
  })
}

const _degressToRadian = (degrees) => {
  return (degrees * Math.PI / 180.0)
}

const RADIUS_KM = 6371

const distanceInKilometres = (_lat1, _lng1, _lat2, _lng2) => {
  const lat1 = _degressToRadian(_lat1)
  const lng1 = _degressToRadian(_lng1)
  const lat2 = _degressToRadian(_lat2)
  const lng2 = _degressToRadian(_lng2)

  const diffLat = lat2 - lat1
  const diffLng = lng2 - lng1
  console.log(diffLat)
  console.log(diffLng)

  const a = Math.pow(Math.sin(diffLat/2),2 ) + 
            // Math.sin(diffLat/2) * Math.sin(diffLat/2) + 
            Math.cos(lat1) * Math.cos(lat2) *
            Math.pow(Math.sin(diffLng / 2), 2)
            // Math.sin(diffLng / 2) * Math.sin(diffLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  console.log(a)
  console.log(c)
  console.log(RADIUS_KM * c)
  return RADIUS_KM * c
}

distanceInKilometres(51.511461, 0.063697, 53.339428, -6.257664)


module.exports = {
  _degressToRadian,
  distanceInKilometres,
  readFile
}

// readFile('./customers.txt')
//   .then(customers => {
//     console.log(customers)
//   })
//   .catch(err => {
//     throw err
//   })
