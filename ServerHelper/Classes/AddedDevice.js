import { v4 as uuidv4 } from 'uuid'

export default class AddedDevice {
  constructor({ _deviceId, category, locationId = undefined, controllerId = undefined, childIds = [] }) {
    this._id = uuidv4()
    this._deviceId = _deviceId
    this.category = category
    this.locationId = locationId
    this.controllerId = controllerId
    this.childIds = childIds
  }


}