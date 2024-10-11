export class Project {
  constructor({ name, street, city, zip, state, id, zones, materials, devices, group, locationDescriptionList }) {
    this.name = name
    this.street = street
    this.city = city
    this.zip = zip
    this.state = state
    this.id = id

    this.zones = zones
    this.materials = materials
    this.devices = devices
    this.projectGroup = group || 'none'
    this.locationDescriptionList = locationDescriptionList || []
  }
  addMaterial() { }
  removeMaterial() { }
  addDevice() { }
  removeDevice() { }
  addLocation() { }
  removeLocation() { }
}