





export const processData_deviceView = ({ usedDevices, zones, locations, devices, locationListObject }) => {
  const log = false;
  log && console.group('processData_deviceView')
  const _usedDevicesArray = []

  usedDevices.forEach(usedDevice => {
    const _usedDeviceItem = { id: usedDevice._id, zonesHaveDeviceItem: [] }
    log && console.log(` - Checking for device (${usedDevice.name})`)

    zones.forEach(zoneObject => {
      zoneObject.locations.forEach(locationId => {
        const locationObject = locationListObject[locationId]
        log && console.log(`         - Checking in zone (${zoneObject._id}) -- Location (${locationObject._id})`)

        const hasHeadId = locationObject.headId !== undefined || '' ? true : false

        locationObject.deviceIds.forEach(addedDeviceId => {
          const addedDeviceObject = devices.find(device => device._id === addedDeviceId)
          log && console.log(`                  - Matching against device (${addedDeviceObject._id}) -- deviceId: ${addedDeviceObject._deviceId}`)

          if (addedDeviceObject._deviceId === usedDevice._id) {
            log && console.log('                         Matched device.')
            if (!hasHeadId) {
              _usedDeviceItem.locationsWithouthHeadIds.push(locationObject._id)
            }
            else {
              log && console.log(`                         _usedDeviceItem: `, _usedDeviceItem)
              // @ts-ignore
              let zItemIndex = _usedDeviceItem.zonesHaveDeviceItem?.findIndex(_zItem => _zItem.zoneId === zoneObject._id)
              if ((!zItemIndex && zItemIndex !== 0) || zItemIndex < 0) {
                log && console.log(`                         Pushing new zone (${zoneObject._id}) item to zonesHaveDeviceItem`)
                // @ts-ignore
                zItemIndex = _usedDeviceItem.zonesHaveDeviceItem.push({ zoneId: zoneObject._id, zoneHasLocationsIds: [], devicesInZoneCount: 0 }) - 1
              }
              log && console.log(`                         zitemIndex:${zItemIndex}`)
              // @ts-ignore
              if (_usedDeviceItem.zonesHaveDeviceItem[zItemIndex].zoneHasLocationsIds.findIndex(l => l === locationObject._id) < 0) {
                log && console.log(`                         pushing new location (${locationListObject._id}) to zoneHasLocationsIds`)
                // @ts-ignore
                _usedDeviceItem.zonesHaveDeviceItem[zItemIndex].zoneHasLocationsIds.push(locationObject._id)
              }
              log && console.log(`                         zitemIndex:${zItemIndex}`)
              // @ts-ignore
              log && console.log(`                         adding count to zonesHaveDeviceItem[${zItemIndex}](curr:${_usedDeviceItem.zonesHaveDeviceItem[zItemIndex].devicesInZoneCount})`)
              // @ts-ignore
              _usedDeviceItem.zonesHaveDeviceItem[zItemIndex].devicesInZoneCount += 1


            }
          }
        });
      });
    });

    _usedDevicesArray.push(_usedDeviceItem)
  })

  // [ ] filter all device list with devices added to usedDevicesArray for 'devicesWithoutLocations'


  /*
    const usedDevicesArray = [
      { 
        // [x] id:'100', 
        // [x] locationsWithoutHeadIds = [],
        // [x] zonesHaveDeviceItem:[
          { 
            // [x] zoneId, 
            // [x] zoneHasLocationsIds, 
            // [x] devicesInZoneCount: 0 
          }
        ]
      }
    ]
  */
  log && console.log({ _usedDevicesArray })
  log && console.groupEnd()
  return _usedDevicesArray

}

export const processData_locationView = ({ locationListObject, locations, devices, deviceListObject, zones, usedDevices, zoneListObject }) => {
  const log = false
  log && console.group("processData_locationView")
  const processedLocationData = {
    locationCount: locations.length - zones.length,
    zoneCount: zones.length,
    locationItemsList: [

    ]
  }

  locations.forEach(locationObject => {
    const hasZoneHead = locationObject.headId || locationObject.headId === 0 ? true : false
    const isZoneHead = zones.find(zone => zone.locationId === locationObject._id) ? true : false
    const zoneObject = hasZoneHead ? zoneListObject[locationObject.headId] : undefined

    const locationItem = {
      isZoneHead,
      hasZoneHead,
      zoneHeadName: hasZoneHead ? locationListObject[zoneObject.locationId].name : '-',
      zoneHeadId: hasZoneHead ? zoneObject._id : undefined,
      locationName: locationObject.name,
      locationId: locationObject._id,
      deviceListIds: locationObject.deviceIds.filter(id => id)
    }





    // @ts-ignore
    processedLocationData.locationItemsList.push(locationItem)
  });


  /*
  
  {
    locationCount, 
    zoneCount,
    locationItemList:[
      {zoneHeadName, locationName, locationId, isZoneHead, hasZoneHead, deviceListIds: [] }
    ]
  }

  */

  log && console.log({ processedLocationData })
  log && console.groupEnd()
  return processedLocationData
}

export const processData_zoneView = ({ zones, usedDevices, devices, deviceListObject }) => {
  const log = true
  log && console.group('processData_zoneView')
  const _usedZonesArray = []

  zones.forEach(zone => {
    usedDevices.forEach(usedDevice => {
      devices.forEach(device => {
        const addedDeviceMatchesUsedDevice = usedDevice._id === device._deviceId
        if (addedDeviceMatchesUsedDevice && [zone.locationId, ...zone.locations].includes(device.locationId)) {

          let usedZoneIndex = _usedZonesArray.findIndex(_usedZone => _usedZone.zoneId === zone._id)


          if (usedZoneIndex < 0)
            usedZoneIndex = _usedZonesArray.push({ zoneId: zone._id, usedDevicesInZoneItem: [{ deviceId: usedDevice._id, count: 0 }] }) - 1

          let usedDeviceInZoneItemIndex = _usedZonesArray[usedZoneIndex].usedDevicesInZoneItem.findIndex(deviceInZone => deviceInZone.deviceId === usedDevice._id)

          if (usedDeviceInZoneItemIndex < 0)
            usedDeviceInZoneItemIndex = _usedZonesArray[usedZoneIndex].usedDevicesInZoneItem.push({ deviceId: usedDevice._id, count: 0 }) - 1

          _usedZonesArray[usedZoneIndex].usedDevicesInZoneItem[usedDeviceInZoneItemIndex].count += 1
        }
      })
    });
  });

  /*
  
  const _usedZonesArray = [
    { zoneId, usedDevicesInZoneItem: [
      { deviceId, count } 
    ],  }
  ]
  
  */


  log && console.log({ _usedZonesArray })
  log && console.groupEnd()
  return _usedZonesArray
}

export const processData_overview = ({ devices, deviceListObject, zoneListObject, locationListObject }) => {
  // @ts-ignore
  // @ts-ignore
  const log = false
  log && console.group("processData_overview")


  const cctvData = {
    totalCount: 0,
    deviceListItems: []
  }
  const acData = {
    totalCount: 0,
    deviceListItems: []
  }
  const networkData = {
    totalPortCount: 0,
    zoneList: []
  }

  // [x] cctvData
  // [x] acData

  devices.forEach(addedDevice => {
    // @ts-ignore
    const usedDevice = deviceListObject[addedDevice._deviceId]

    if (usedDevice.category === 'cctv') {
      cctvData.totalCount += 1

      // @ts-ignore
      let deviceListItemIndex = cctvData.deviceListItems.findIndex(item => item.id === addedDevice._deviceId)
      // @ts-ignore
      if (deviceListItemIndex < 0)
        // @ts-ignore
        deviceListItemIndex = cctvData.deviceListItems.push({ name: usedDevice.name, id: addedDevice._deviceId, count: 0 }) - 1

      // @ts-ignore
      cctvData.deviceListItems[deviceListItemIndex].count += 1
    }

    else if (usedDevice.category === 'ac') {
      acData.totalCount += 1

      // @ts-ignore
      let deviceListItemIndex = acData.deviceListItems.findIndex(item => item.id === addedDevice._deviceId)
      // @ts-ignore
      if (deviceListItemIndex < 0)
        // @ts-ignore
        deviceListItemIndex = acData.deviceListItems.push({ name: usedDevice.name, id: addedDevice._deviceId, count: 0 }) - 1

      // @ts-ignore
      acData.deviceListItems[deviceListItemIndex].count += 1
    }




    if (usedDevice.networked) {
      networkData.totalPortCount += 1

      const noZone = !addedDevice.locationId || !locationListObject[addedDevice.locationId].headId
      const zoneObject = noZone ? {} : zoneListObject[locationListObject[addedDevice.locationId].headId]
      const zoneId = noZone ? 'unassigned' : zoneObject._id
      const zoneName = noZone ? 'unassigned' : locationListObject[zoneObject.locationId].name

      // @ts-ignore
      let zoneItemIndex = networkData.zoneList.findIndex((zoneItem) => zoneItem.zoneId === zoneId)

      if (zoneItemIndex < 0)
        // @ts-ignore
        zoneItemIndex = networkData.zoneList.push({
          zoneId,
          zoneName,
          portCounts: {
            data: 0,
            poe: 0,
            poe_p: 0,
            poe_pp: 0
          }
        }) - 1

      switch (usedDevice.powerInput.toLowerCase()) {
        case 'poe':
          // @ts-ignore
          networkData.zoneList[zoneItemIndex].portCounts.poe += 1
          break;
        case 'poe+':
          // @ts-ignore
          networkData.zoneList[zoneItemIndex].portCounts.poe_p += 1
          break;
        case 'poe++':
          // @ts-ignore
          networkData.zoneList[zoneItemIndex].portCounts.poe_pp += 1
          break;
        default:
          // @ts-ignore
          networkData.zoneList[zoneItemIndex].portCounts.data += 1
      }
    }
  })


  // [x] networkData





  /*

    { 
      cctvData: { totalCount, deviceListItems: [
        { name, id, count }
      ]}, 
      acData:  { totalCount, deviceListItems: [
        { name, id, count }
      ]}, 
      networkData: {
        totalPortCount,
        zoneList: [
          { zoneId, zoneName, portCounts: {
            data:
            poe:
            poe_p:
            poe_pp:
          }}
        ]
      }
    }
  
  */


  const overviewData = { cctvData, acData, networkData }
  log && console.log({ overviewData })
  log && console.groupEnd()
  return overviewData
}

export const selectList_zones = (zones, locationListObject) => {
  const data = [{ key: '', value: 'Select a zone' }]

  zones.forEach(zone => {
    data.push({ key: zone._id, value: locationListObject[zone.locationId].name })
  });

  return data
}

export const selectList_devices = (simpleDeviceList) => {
  const data = [{ key: "", value: "Select a device" }]

  simpleDeviceList.forEach(device =>
    data.push({ key: device._id, value: device.name })
  )


  return data
}