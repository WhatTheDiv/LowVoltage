import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  projectNamesAndIds: [],
  currentProject: {
    _id: '',
    name: '',
    street: '',
    city: '',
    zip: '',
    state: '',
    group: '',
    zones: [],
    devices: [],
    materials: [],
  },
  currentProjectHydrated: false
}

const projects = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    syncProjectList: (state, action) => {
      if (action.payload.projectNamesAndIds !== undefined)
        state.projectNamesAndIds = action.payload.projectNamesAndIds
    },
    hydrateProject: (state, action) => {
      if (action.payload.project !== undefined) {
        state.currentProject = action.payload.project
        state.currentProjectHydrated = true
      }
    },
    clearLoadedProject: (state, action) => {
      state.currentProject = initialState.currentProject
      state.currentProjectHydrated = false
    }
  }
})

export default projects.reducer

export const { hydrateProject, clearLoadedProject, syncProjectList } = projects.actions