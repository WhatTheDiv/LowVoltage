import { v4 as uuidv4 } from 'uuid'
import Contact from './Contact.js'

/*
          Requires: 

          new Entity - ( entityName, ownerFname, db )
          new Project - ( name )
          new Contact - ( fname )
          new GlobalDevice - ( name, networked, iconType, iconColor, powerInput, category )

*/

export default class Project {
  constructor({
    _id = uuidv4(), name, street = undefined, city = undefined, zip = undefined, state = undefined,
    group = 'none', propertyContacts = [], addedDevicesItems = [], locations = [],
    zones = [], materials = [],
  }) {
    this._id = _id
    this.details = {
      name,
      street,
      city,
      zip,
      state,
      group,
      propertyContacts: propertyContacts.map(contactDetails => new Contact(contactDetails)),
    }
    this.addedDevicesItems = addedDevicesItems
    this.locations = locations
    this.zones = zones
    this.materials = materials
  }

  // flattens object
  formatForDb() {
    const projectDetailsForDb = {
      _id: this._id,
      addedDevicesItems: this.addedDevicesItems,
      locations: this.locations,
      zones: this.zones,
      materials: this.materials,
      name: this.details.name
    }

    if (this.details.city) projectDetailsForDb.city = this.details.city
    if (this.details.zip) projectDetailsForDb.zip = this.details.zip
    if (this.details.state) projectDetailsForDb.state = this.details.state
    if (this.details.group) projectDetailsForDb.group = this.details.group
    if (this.details.propertyContacts.length > 0)
      projectDetailsForDb.propertyContacts = this.details.propertyContacts.map(contactObj =>
        contactObj.formatForDb()
      )


    return projectDetailsForDb
  }

  // (pass) returns index of new location
  // (fail) returns -1
  addLocationToProject(locationName) {
    if (!locationName) return -1

    return this.locations.push({
      _id: uuidv4(),
      name: locationName,
      headId: '',
      deviceIds: []
    }) - 1
  }

  // (pass) returns index of new zone
  // (fail) returns -1
  addZoneToProject(locationId) {
    try {
      const locIndex = this.locations.findIndex(location => location._id === locationId)

      if (locIndex < 0)
        throw new Error(`Could not find location with id (${locationId})`)

      const zone = {
        _id: uuidv4(),
        locationId: this.locations[locIndex]._id,
        locations: []
      }

      const zoneIndex = this.zones.push(zone) - 1
      this.locations[locIndex].headId = zone._id

      return zoneIndex

    } catch (e) {
      console.error(`Error adding zone to project - ${e.message}`)
      return -1
    }
  }

  // (pass) returns index of new location ID
  // (fail) returns -1
  addLocationToZone(zoneId, locationId) {
    try {
      if (!zoneId) throw new Error(`Bad zone id (${zoneId})`)
      else if (!locationId) throw new Error(`Bad location id (${locationId})`)

      const zoneIndex = this.zones.findIndex(zone => zone._id === zoneId)

      if (zoneIndex < 0) throw new Error(`Could not find zone with id (${zoneId})`)

      if (this.zones[zoneIndex].locations.includes(locationId))
        throw new Error('Location already exists in this zone')

      const index = this.zones[zoneIndex].locations.push(locationId) - 1
      const location = this.locations.find(location => location._id === locationId)
      location.headId = zoneId


      return index

    } catch (e) {
      console.error(`Error adding location to zone - ${e.message}`)
      return -1
    }
  }

  // (pass) returns deleted location ID
  // (fail) returns null
  removeLocationFromZone(zoneId, locationId) {
    try {
      if (!zoneId) throw new Error(`Bad zone id (${zoneId})`)
      else if (!locationId) throw new Error(`Bad location id (${locationId})`)

      const zoneIndex = this.zones.findIndex(zone => zone._id === zoneId)

      if (zoneIndex < 0) throw new Error(`Could not find zone with id (${zoneId})`)

      const locationIdIndexInZone = this.zones[zoneIndex].locations.findIndex(id => id === locationId)

      if (locationIdIndexInZone < 0)
        throw new Error('Location does not exist in this zone')

      return this.zones[zoneIndex].locations.splice(locationIdIndexInZone, 1)

    } catch (e) {
      console.error(`Error removing location from zone - ${e.message}`)
      return null
    }
  }

  // (pass) returns index of device ID in location devices array
  // (fail) returns -1
  addDeviceToLocation(locationId, addedDeviceId) {
    try {
      if (!locationId) throw new Error(`Bad location id (${locationId})`)
      else if (!addedDeviceId) throw new Error(`Bad device id (${addedDeviceId})`)

      const deviceItemIndex = this.addedDevicesItems.findIndex(deviceItem => deviceItem._id === addedDeviceId)

      if (deviceItemIndex < 0) throw new Error(`Could not find added device with id ${addedDeviceId}`)

      const locationIndex = this.locations.findIndex(location => location._id === locationId)

      if (locationIndex < 0) throw new Error(`Could not find location with id ${locationId}`)

      const foundDeviceId = this.addedDevicesItems[deviceItemIndex]._id
      const foundLocationId = this.locations[locationIndex]._id

      if (this.locations[locationIndex].deviceIds.includes(foundDeviceId))
        throw new Error(`Device already exists at this location`)

      const indexOfNewDeviceItem = this.locations[locationIndex].deviceIds.push(foundDeviceId) - 1
      this.addedDevicesItems[deviceItemIndex].locationId = foundLocationId

      return indexOfNewDeviceItem

    } catch (e) {
      console.error(`Error adding device to location - ${e.message}`)
      return null
    }
  }

  // (pass) returns addedDeviceItem that was deleted
  // (fail) returns null
  removeDeviceFromLocation(locationId, addedDeviceId) {
    try {
      if (!locationId) throw new Error(`Bad location id (${locationId})`)
      else if (!addedDeviceId) throw new Error(`Bad device id (${addedDeviceId})`)


      const locationIndex = this.locations.findIndex(location => location._id === locationId)
      const location = this.locations[locationIndex]

      if (locationIndex < 0) throw new Error(`Could not find location with id ${locationId}`)

      const deviceItemIdInLocationDevicesArrayIndex = location.deviceIds.findIndex(deviceItemId => deviceItemId === addedDeviceId)

      if (deviceItemIdInLocationDevicesArrayIndex < 0) throw new Error(`Could not find device at this location with id ${addedDeviceId}`)

      const deviceItem = this.addedDevicesItems[deviceItemIdInLocationDevicesArrayIndex]
      const foundLocationId = location._id

      if (!location.deviceIds.includes(deviceItem._id))
        throw new Error(`Device does not exist at this location`)

      const deletedItem = this.locations[locationIndex].deviceIds.splice(deviceItemIdInLocationDevicesArrayIndex, 1)
      this.addedDevicesItems[deviceItemIdInLocationDevicesArrayIndex].locationId = ''

      return deletedItem

    } catch (e) {
      console.error(`Error removing device from location - ${e.message}`)
      return null
    }
  }

  // ONLY USED BY ENTITY OBJECT
  // returns array of deviceIds
  getUsedDevices() {
    // ########################  ONLY USED BY ENTITY OBJECT  ########################
    try {
      return [... new Set(this.addedDevicesItems.map(deviceItem => deviceItem._deviceId))]
    } catch (e) {
      console.error(`Unexpected error getting used devices from project: ${e.message}`)
      return []
    }
  }





}
