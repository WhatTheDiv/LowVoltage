import { v4 as uuidv4 } from 'uuid'
import Status from '../../client/helper/Status.mjs';

export class deviceHandler {
  constructor() {
    this.db = {}
  }
  assignDb(db) {
    this.db = db
  }
  async hydrateDevices(deviceArr, status) {
    if (!deviceArr || !Array.isArray(deviceArr))
      status.error(`Invalid device list`)

    else if (deviceArr.length < 1) {
      console.log(`No device list to hydrate`)
      return []
    }

    // pull devices from database
    const devices = await this.db.asyncFind({
      $or:
        deviceArr.map(d => ({ _id: d._id }))

    })

    // throw error if no devices hydrated
    if (!devices || devices.length < 1) {
      status.error(`Devices not found`)
    }

    // otherwise replace device list in project with hydrated version
    const hydratedDeviceList = devices

    return hydratedDeviceList
  }

  // goes through an array of devices and adds the ones not in the database, returns { name, id } of all 
  async addNewDevicesInList(deviceList = [], _status) {
    const activeStatus = _status ? true : false
    const status = activeStatus ? _status : new Status()

    const trimmedDeviceList = []
    const allNewDevices = []
    const hydratedDeviceList = []



    if (!Array.isArray(deviceList)) status.error('Bad array, addNewDevicesInList')


    // [ ] optimize DeviceHandler with db.asyncFind()
    for (let index = 0; index < deviceList.length; index++) {
      const device = deviceList[index]
      await this.db.asyncFindOne({ name: device.name, category: device.category }).then(d => {
        if (d) {
          console.log(`device (${d.name}), category (${d.category}), exists.`)
          trimmedDeviceList.push({ name: d.name, _id: d._id })
          hydratedDeviceList.push(d)
        }
        else {
          console.log(`device (${device.name}) does not exist, adding.`)
          device._id = uuidv4()
          allNewDevices.push({ index, device })
        }
      }).catch(e => {
        status.softError(`Error looking for device ${index + 1} - ${device.name}, not adding - ${e.message}`)
      })
    }



    if (allNewDevices.length > 0) {
      await this.db.asyncInsert(allNewDevices.map(obj => obj.device)).then(docs => {
        if (Array.isArray(docs)) {
          docs.forEach(d => {
            trimmedDeviceList.push({ name: d.name, _id: d._id })
            hydratedDeviceList.push(d)
          });
        }
        else status.error(`Should have added new devices but didnt`)
      }).catch(e => {
        status.error(`Failed to add ${allNewDevices.length} devices - ${e.message}`)
      })

    }

    return { trimmedDeviceList, hydratedDeviceList }
  }
}