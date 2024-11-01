import { v4 as uuidv4 } from 'uuid'
import AddedDevice from './AddedDevice.js'

/*
          Requires: 

          new Entity - ( entityName, ownerFname )
          new Project - ( name )
          new Contact - ( fname )
          new GlobalDevice - ( name, networked, iconType, iconColor, powerInput, category )
          new AddedDevice - ( _deviceId, category  )

*/

export default class GlobalDevice {
  constructor({
    _id = uuidv4(), name, networked, iconType, iconColor, powerInput, category,
    description = undefined, color = undefined, model = undefined,
    subcategory = undefined, manufacturer = undefined, url = undefined
  }) {
    this._id = _id
    this.name = name
    this.description = description
    this.manufacturer = manufacturer
    this.model = model
    this.color = color
    this.networked = networked
    this.powerInput = powerInput
    this.category = category
    this.subcategory = subcategory
    this.url = url
    this.iconType = iconType
    this.iconColor = iconColor
  }
  formatForDb() {
    const deviceDetailsForDb = {
      _id: this._id,
      name: this.name,
      networked: this.networked,
      iconType: this.iconType,
      iconColor: this.iconColor,
      powerInput: this.powerInput,
      category: this.category
    }

    if (this.description) deviceDetailsForDb.description = this.description
    if (this.color) deviceDetailsForDb.color = this.color
    if (this.model) deviceDetailsForDb.model = this.model
    if (this.subcategory) deviceDetailsForDb.subcategory = this.subcategory
    if (this.manufacturer) deviceDetailsForDb.manufacturer = this.manufacturer
    if (this.url) deviceDetailsForDb.url = this.url

    return deviceDetailsForDb
  }

  addToProject(projectObject) {
    return projectObject.addedDevicesItems.push(new AddedDevice({ _deviceId: this._id, category: this.category })) - 1
  }
}
