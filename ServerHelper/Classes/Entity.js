import { v4 as uuidv4 } from 'uuid'
import Project from './Project.js'
import Contact from './Contact.js'
import GlobalDevice from './GlobalDevice.js'

/*
          Requires: 

          new Entity - ( entityName, ownerFname, db )
          new Project - ( name )
          new Contact - ( fname )
          new GlobalDevice - ( name, networked, iconType, iconColor, powerInput, category )

*/


export default class Entity {
  constructor({
    _id = uuidv4(),
    entityName,
    ownerDetails = { fname: 'dummy' },
    dummyOwner = false,
    company = 'none',
    entityProjects = [],
    entityDevices = [],
    db
  }) {
    this._id = _id
    this.entityName = entityName
    this.ownerDetails = new Contact({ ...ownerDetails, dummy: dummyOwner })
    this.company = company
    this.entityProjects = entityProjects.map(projectDetails => new Project(projectDetails))
    this.entityDevices = entityDevices.map(entityDeviceDetails => new GlobalDevice(entityDeviceDetails))
    this.db = db
  }

  formatForDb() {
    return {
      _id: this._id,
      entityName: this.entityName,
      ownerDetails: this.ownerDetails.formatForDb(),
      company: this.company,
      entityProjects: this.entityProjects.map(project => project.formatForDb()),
      entityDevices: this.entityDevices.map(device => device.formatForDb()),
    }
  }

  getProjectNamesAndIds() {
    try {
      const arr = this.entityProjects.map(project => ({ _id: project._id, name: project.details.name }))
      return { allProjectNamesAndIds: arr }
    } catch (e) {
      return { errorMessage: e.message }
    }
  }

  createNewDevice(deviceDetails) {
    return this.entityDevices.push(new GlobalDevice(deviceDetails)) - 1
  }

  getSimpleDeviceList() {
    return this.entityDevices.map(device => ({ name: device.name, _id: device._id }))
  }

  getUsedDeviceList(projectObj) {
    const usedDeviceIds = projectObj.getUsedDevices()
    return this.entityDevices
      .filter(device => usedDeviceIds.includes(device._id))
      .map(d => d.formatForDb())
  }

  createNewProject(projectDetails) {
    return this.entityProjects.push(new Project(projectDetails)) - 1
  }

  async saveProjects() {
    await this.db.asyncUpdate(
      { _id: this._id },
      { $set: { entityProjects: this.entityProjects.map(p => p.formatForDb()) } }
    )
  }

  findGlobalDevice_name(deviceName) {
    return this.entityDevices.find(device => device.name === deviceName)
  }

  getProjectObject_id(projectId) {
    const proj = this.entityProjects.find(project => project._id === projectId)
    console.log({ proj })
    return proj
  }




}
