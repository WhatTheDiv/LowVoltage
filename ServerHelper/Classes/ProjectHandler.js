import { v4 as uuidv4 } from 'uuid'
import { AsyncNedb } from 'nedb-async'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import Status from '../../client/helper/Status.mjs'
import { Project } from './Project.js'
import { Material } from './Material.js'
import { deviceHandler } from './DeviceHandler.js'


// [x] init
// [x] createNewProject
// [x] saveNewProject
// [x] generateProjectList

export class projectHandler {
  constructor() {
    this.active = false
    this.projectList = []
    this.projectsDb = {}
    this.DeviceHandler = new deviceHandler()
    // this.MaterialHandler = new materialHandler()
  }

  async init() {
    this.active = true

    const devicesDb = new AsyncNedb({
      filename: resolve('./ServerHelper/StoredData/Devices.db'),
      autoload: true
    })
    const projectsDb = new AsyncNedb({
      filename: resolve('./ServerHelper/StoredData/Projects.db'),
      autoload: true
    })
    const materialsDb = new AsyncNedb({
      filename: resolve('./ServerHelper/StoredData/Materials.db'),
      autoload: true
    })

    this.projectsDb = projectsDb
    this.DeviceHandler.assignDb(devicesDb)

    this.projectList = await this.getAndUpdateProjectNamesAndIds();
    // this.MaterialHandler.assignDb(devicesDb)

  }
  errorIfInvalidProjectParameters({ status, projectName, street, city, zip, state }) {
    if (projectName === undefined)
      status.error(`Bad name (${projectName})`)
    else if (street === undefined)
      status.error(`Bad address (street:${street})`)
    else if (city === undefined)
      status.error(`Bad address (city:${city})`)
    else if (zip === undefined)
      status.error(`Bad address (zip:${zip})`)
    else if (isNaN(Number(zip)))
      status.error(`Bad address (zip:${zip})`)
    else if (state === undefined)
      status.error(`Bad address (state:${state})`)
  }
  async errorIfProjectNameExists(status, name) {
    await this.projectsDb.asyncFindOne({ name }).catch(e => {
      status.error(`Error searching db for ${name} - ${e.message}`)
    }).then(proj => {
      if (proj)
        status.error(`Project exists in db (${proj._id})`)
    })
  }

  async hydrateProject(_id, status) {
    // find project in database
    const project = await this.projectsDb.asyncFindOne({ _id }).catch(e => {
      status.error(`Database error (project) - ${e.message}`)
    })

    // throw error if no project found with this id
    if (!project)
      status.error(`Project not found (${_id})`)

    return project

  }

  async createNewProject({
    projectName,
    street,
    city,
    zip,
    state,
    zones = [],
    devices = [],
    materials = [],
    group
  }) {

    const status = new Status()
    const returnObj = { status, project: {} }

    // [x] Verifies user input
    // [x] Creates UUID
    // [x] Initializes project
    // [x] creates new devices for any non-repeating new devices
    // [ ] creates new material for any non-repeating new material
    // [x] Saves new project & updates projectList

    try {
      // error handle bad parameters
      this.errorIfInvalidProjectParameters({ status, projectName, street, city, zip, state })

      // error handle duplicate project
      await this.errorIfProjectNameExists(projectName, status)

      // add devices that arent added already
      const { trimmedDeviceList, hydratedDeviceList } = await this.DeviceHandler.addNewDevicesInList(devices, status)

      // add material that isnt added already
      const trimmedMaterialList = [] // await this.MaterialHandler.addNewMaterialInList(material, status)

      const project = {
        _id: uuidv4(),
        name: projectName,
        street,
        city,
        zip,
        state,
        group: group || 'none',
        zones,
        materials: trimmedMaterialList || [],
        devices: trimmedDeviceList || []
      }

      await this.projectsDb.asyncInsert(project).catch(e => {
        status.error(`Insert to db failed - ${e.message}`)
      })

      project.devices = hydratedDeviceList
      returnObj.project = project

      status.complete()

      const { success, noErrors } = status.getStatusReport()

      if (success) {
        if (!noErrors)
          status.printReport();
      }

    } catch (e) {
      console.error(`Failed to create new project: ${e.message}`)
    }

    await this.getAndUpdateProjectNamesAndIds();

    console.log('projectHandler', returnObj)

    return returnObj
  }

  async getProjectData(id) {
    const status = new Status()

    try {
      // find project in database
      const project = await this.hydrateProject(id, status)

      // replace dehydrated device list in project
      project.devices = await this.DeviceHandler.hydrateDevices(project.devices, status)

      // const materials = await this.MaterialHandler.hydrateMaterials(project.materials, status)

      // complete method
      status.complete()
      return { status, project }

    } catch (e) {
      if (!status.didFail())
        status.unexpectedError(e.message)
      return { status, project: {} }
    }
  }

  async getAndUpdateProjectNamesAndIds() {

    this.projectList = await this.projectsDb.asyncFind({}, { name: 1, _id: 1 })
      .then(projList => {
        return projList
      })
      .catch(e => {
        console.error('Failed to update project list')
        return []
      })

    // await this.projectsDb.AsyncFind({}, { name: 1, _id: 1 }, (err, docs) => {

    //   if (!err) {
    //     this.projectList = docs || []
    //     return
    //   }
    // })
    return this.projectList
  }
}
