// @ts-nocheck
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  projectName: 'InitialnewProject',
  street: '559 lakeview ave',
  city: 'bayport',
  zip: '11705',
  state: 'NY',
  newLocationName: 'stairwell',
  newZoneName: 'MDF',
  newZoneLocation_id: '',
  zones: [],
  deviceLocations: [{ name: 'Leasing office by door', id: '', deviceIds: [] }, { name: 'main entrance', id: '', deviceIds: [] }],
  newDevice: true,
  newDeviceName: 'Fixed cam',
  newDevicDescription: 'Fixed camera painted black',
  newDeviceColor: 'black',
  newDeviceModel: 'unv123',
  newDevicePowerInput: 'PoE',
  newDeviceCategory: 'camera',
  newDeviceSubcategory: 'dome',
  newDeviceManufacturer: 'uniview',
  newDeviceUrl: 'www.cameras.com/123',
  devices: [],
  materials: [],
}

const newProject = createSlice({
  name: 'newProject',
  initialState,
  reducers: {
    resetForm: (state, action) => {
      if (action.payload.reset) {
        for (const key in state) {
          state[key] = initialState[key]
        }
      }
    },
    setProjectName: (state, action) => {
      if (action.payload.projectName !== undefined)
        state.projectName = action.payload.projectName
    },
    setStreet: (state, action) => {
      if (action.payload.street !== undefined)
        state.street = action.payload.street
    },
    setCity: (state, action) => {
      if (action.payload.city !== undefined)
        state.city = action.payload.city
    },
    setZip: (state, action) => {
      if (action.payload.zip !== undefined)
        state.zip = action.payload.zip
    },
    setState: (state, action) => {
      if (action.payload.state !== undefined)
        state.state = action.payload.state
    },
    setZone: (state, action) => {
      if (action.payload.newZoneName !== undefined)
        state.newZoneName = action.payload.newZoneName

      if (action.payload.newZoneLocation_id !== undefined)
        state.newZoneLocation_id = action.payload.newZoneLocation_id
    },
    setLocation: (state, action) => {
      if (action.payload.locationName !== undefined)
        state.newLocationName = action.payload.locationName

    },
    removeZone: (state, action) => {
      if (action.payload.zoneName !== undefined) {
        const i = state.zones.findIndex(z => z.name === action.payload.zoneName)
        if (i >= 0)
          state.zones.splice(i, 1)
      }

    },
    setDevice: (state, action) => {
      if (action.payload.newDeviceName !== undefined)
        state.newDeviceName = action.payload.newDeviceName

      if (action.payload.newDevicDescription !== undefined)
        state.newDevicDescription = action.payload.newDevicDescription

      if (action.payload.newDeviceColor !== undefined)
        state.newDeviceColor = action.payload.newDeviceColor

      if (action.payload.newDeviceModel !== undefined)
        state.newDeviceModel = action.payload.newDeviceModel

      if (action.payload.newDevicePowerInput !== undefined)
        state.newDevicePowerInput = action.payload.newDevicePowerInput

      if (action.payload.newDeviceCategory !== undefined)
        state.newDeviceCategory = action.payload.newDeviceCategory

      if (action.payload.newDeviceSubcategory !== undefined)
        state.newDeviceSubcategory = action.payload.newDeviceSubcategory

      if (action.payload.newDeviceManufacturer !== undefined)
        state.newDeviceManufacturer = action.payload.newDeviceManufacturer

      if (action.payload.newDeviceUrl !== undefined)
        state.newDeviceUrl = action.payload.newDeviceUrl
    },
    addDevice: (state, action) => {
      if (state.newDeviceName.trim() !== '' && state.devices.findIndex(d => {
        const sameManufacturer = d.manufacturer === state.newDeviceManufacturer
        const sameName = d.name === state.newDeviceName
        const sameModel = d.model === state.newDeviceModel
        const sameColor = d.color === state.newDeviceColor
        const samePower = d.powerInput === state.newDevicePowerInput
        const sameCategory = d.category === state.newDeviceCategory
        const sameSubCategory = d.subcategory === state.newDeviceSubcategory
        const sameUrl = d.url === state.newDeviceUrl

        if (sameName) return true
        // else if (
        //   sameManufacturer &&
        //   sameModel &&
        //   sameColor &&
        //   samePower &&
        //   sameCategory &&
        //   sameSubCategory &&
        //   sameUrl
        // ) return true
      }) < 0) {

        state.devices.push({
          name: state.newDeviceName,
          description: state.newDevicDescription,
          color: state.newDeviceColor,
          model: state.newDeviceModel,
          powerInput: state.newDevicePowerInput,
          category: state.newDeviceCategory,
          subcategory: state.newDeviceSubcategory,
          manufacturer: state.newDeviceManufacturer,
          url: state.newDeviceUrl,
        })

        for (const key in state) {
          if (key.indexOf("newDevice") >= 0)
            state[key] = initialState[key]
        }

        // state.newDeviceName = ""
        // state.newDevicDescription = ""
        // state.newDeviceColor = ""
        // state.newDeviceModel = ""
        // state.newDevicePowerInput = ""
        // state.newDeviceCategory = ""
        // state.newDeviceSubcategory = ""
        // state.newDeviceManufacturer = ""
        // state.newDeviceUrl = ""
      }
    },
    clearDevice: (state, action) => {
      if (action.payload.clear) {
        for (const key in state) {
          if (key.indexOf("newDevice") >= 0)
            state[key] = initialState[key]
        }
      }
    },
    removeDevice: (state, action) => {
      if (action.payload.deviceName !== undefined) {
        const i = state.devices.findIndex(d => d.name === action.payload.deviceName)
        if (i >= 0)
          state.devices.splice(i, 1)
      }
    },
  }
})

export default newProject.reducer

export const {
  setDevice,
  addDevice,
  removeDevice,
  removeZone,
  setZone,
  addZone,
  setLocation,
  setProjectName,
  setStreet,
  setCity,
  setZip,
  setState,
  resetForm,
  clearDevice,
} = newProject.actions