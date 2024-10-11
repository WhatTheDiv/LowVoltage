import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from 'redux'
import projects from './projects_slice.js'
import ui from './ui_slice.js'
import newProject from './newProject_slice.js'

export default configureStore({
  reducer: combineReducers({ projects, ui, newProject })
})