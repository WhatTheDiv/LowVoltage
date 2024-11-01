import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  allProjectNamesAndIds: [],
  currentProject: {
    details: {
      name: '',
      street: '',
      city: '',
      zip: '',
      state: '',
      group: '',
    },
    _id: '',
    zones: [],
    devices: [],
    materials: [],
    usedDevices: [],
    globalDevices: [], // simple list of names and ids
    deviceListObject: {},
    zoneListObject: {},
    locationListObject: {},
    locations: [],

  },
  currentProjectHydrated: false,
  needToRecalculate: false
}

const projects = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    syncProjectList: (state, action) => {
      if (action.payload.allProjectNamesAndIds !== undefined)
        state.allProjectNamesAndIds = action.payload.allProjectNamesAndIds
    },
    hydrateProject: (state, action) => {
      if (action.payload.project !== undefined) {
        const p = action.payload.project


        state.currentProject.details.name = p.name

        if (p.street) state.currentProject.details.street = p.street
        if (p.city) state.currentProject.details.city = p.city
        if (p.zip) state.currentProject.details.zip = p.zip
        if (p.state) state.currentProject.details.state = p.state
        if (p.group) state.currentProject.details.group = p.group

        state.currentProject._id = p._id
        state.currentProject.devices = p.addedDevicesItems
        state.currentProject.zones = p.zones
        state.currentProject.materials = p.materials
        state.currentProject.locations = p.locations

        state.currentProject.details.name = p.name
        state.currentProject.details.name = p.name
        state.currentProject.details.name = p.name
        state.currentProject.details.name = p.name

        state.currentProject.globalDevices = action.payload.simpleGlobalDevices || []
        state.currentProject.usedDevices = action.payload.usedDevices || []

        const deviceListObject = {}
        const zoneListObject = {}
        const locationListObject = {}

        state.currentProject.usedDevices.forEach((device) => {
          // @ts-ignore
          deviceListObject[device._id] = device;
        });

        state.currentProject.zones.forEach((zone) => {
          // @ts-ignore
          zoneListObject[zone._id] = zone;
        });

        state.currentProject.locations.forEach((location) => {
          // @ts-ignore
          locationListObject[location._id] = location;
        });

        state.currentProject.deviceListObject = deviceListObject
        state.currentProject.zoneListObject = zoneListObject
        state.currentProject.locationListObject = locationListObject

        state.currentProjectHydrated = true
        state.needToRecalculate = true
      }
    },
    setNeedToRecalculate: (state, action) => {
      state.needToRecalculate = action.payload
    },
    // @ts-ignore
    clearLoadedProject: (state) => {
      state.currentProject = initialState.currentProject
      state.currentProjectHydrated = false
    }
  }
})

export default projects.reducer

export const { hydrateProject, setNeedToRecalculate, clearLoadedProject, syncProjectList } = projects.actions