
import { AsyncNedb } from 'nedb-async'
import { resolve } from 'node:path'
import Status from '../../client/helper/Status.mjs'
import Entity from './Entity.js'


// [x] init
// [x] createNewProject
// [x] saveNewProject
// [x] generateProjectList

/*

Entities[entityId] = { 
  entityDevices: [
    { _id, name, description, manufacturer, model, color, networked, powerInput, category, subcategory, url, iconType, iconColor }
  ], 
  entityProjects: [
    { 
      addedDevicesItems: [],
      locations: [],
      zones: [],
      materials: [],
      details: { name, street, city, zip, state, group, propertyContacts: [{ fname, lname, phone, email, title }]}
      _id,
    }
  ]
}

*/

export class entityHandler {
  constructor() {
    this.active = false
    this.entitiesDb = {}
  }

  async init(dummy) {
    this.active = true

    this.entitiesDb = new AsyncNedb({
      filename: resolve('./ServerHelper/StoredData/Entities.db'),
      autoload: true
    })

    await this.temp_createDummy(dummy)
  }

  async getEntityObject_id(entityId) {
    return await new Promise(async (res, rej) => {
      await this.entitiesDb.asyncFind({ _id: entityId })
        .then(entity => {
          if (!entity)
            rej(`Entity does not exist with id (${entityId})`)
          else
            res({ entityObject: new Entity({ ...entity, db: this.entitiesDb }) })
        }).catch(e => {
          rej(`(projectNamesAndIds) Error finding entity with id (${entityId}): ${e.message}`)
        })
    })
  }

  async getEntityObject_name(entityName) {
    return await new Promise(async (res, rej) => {
      await this.entitiesDb.asyncFindOne({ entityName })
        .then(entity => {
          if (!entity)
            rej(`Entity '${entityName}' does not exist.`)
          const ent = new Entity({ ...entity, db: this.entitiesDb })
          console.warn('  Entity found: ', ent.entityName)
          res(ent)
        }).catch(e => {
          rej(`(projectNamesAndIds) Error finding entity (${entityName}): ${e.message}`)
        })
    })
  }


  async temp_createDummy({ dummyEntity, dummyProject, dummyDevicesandLocations }) {
    if (!dummyEntity)
      return

    console.log('')
    console.log('')
    console.log('')
    console.log('')
    console.log('')
    console.log('')
    console.log('')
    console.log('')
    console.log('------------------------------------------')
    console.log('------------------------------------------')
    console.log('------------------------------------------')
    console.log('')
    try {
      const entity = await this.getEntityObject_name('firstEntity').catch(e => {
        console.error(`    ${e}`)
        console.log('')
        return undefined
      })


      if (!entity) {
        console.log('')
        // console.log('------------------------------------------')
        console.log('.......... Creating New Entity ...........')
        console.log('')
        const entityObject = new Entity({ entityName: 'firstEntity', ownerDetails: { fname: 'pat' }, dummyOwner: true, db: this.entitiesDb })



        if (!dummyProject)
          return await this.entitiesDb.asyncInsert(entityObject.formatForDb())

        console.log('')
        // console.log('------------------------------------------')
        console.log('.......... Creating New Project ..........')
        console.log('')

        const projectIndex = entityObject.createNewProject({ name: 'FirstProject' })
        const project = entityObject.entityProjects[projectIndex]
        console.log({ project })

        if (!dummyDevicesandLocations)
          return await this.entitiesDb.asyncInsert(entityObject.formatForDb())

        console.log('')
        // console.log('------------------------------------------')
        console.log('............ Creating Devices ............')
        console.log('')

        const _globalDevices = [
          {
            name: "Fixed cam",
            description: "Fixed camera painted black",
            manufacturer: "uniview",
            model: "unv123",
            color: "black",
            networked: true,
            powerInput: "PoE",
            category: "cctv",
            subcategory: "dome",
            url: "www.cameras.com/123",
            iconType: "dc",
            iconColor: "green",
          },
          {
            name: "180 Cam",
            description: "Fixed camera painted black",
            manufacturer: "uniview",
            model: "unv123",
            color: "black",
            networked: true,
            powerInput: "PoE",
            category: "cctv",
            subcategory: "dome",
            url: "www.cameras.com/123",
            iconType: "dc",
            iconColor: "blue",
          },
          {
            name: "360 Cam",
            description: "Fixed camera painted black",
            manufacturer: "uniview",
            model: "unv123",
            color: "black",
            networked: true,
            powerInput: "PoE",
            category: "cctv",
            subcategory: "dome",
            url: "www.cameras.com/123",
            iconType: "dc",
            iconColor: "orange",
          },
          {
            name: "card reader",
            description: "",
            manufacturer: "chirp",
            model: "ethos",
            color: "black",
            networked: false,
            powerInput: "dc",
            category: "ac",
            subcategory: "mullion",
            url: "www.accesscontrol.com/123",
            iconType: "dl",
            iconColor: "orange",
          },
        ];

        _globalDevices.forEach(async device => {
          await entityObject.createNewDevice(device)
        });

        console.log('')
        // console.log('------------------------------------------')
        console.log('............. Adding Devices .............')
        console.log('')

        const global_fixedCam = entityObject.findGlobalDevice_name('Fixed cam')

        if (!global_fixedCam)
          throw new Error('Could not find fixed cam after adding')

        const addedFixedCamIndex = global_fixedCam.addToProject(project)
        const addedFixedCam2Index = global_fixedCam.addToProject(project)

        console.log('')
        // console.log('------------------------------------------')
        console.log('............ Adding Locations ............')
        console.log('')

        const mainEntrLocIndex = project.addLocationToProject('main entrance')
        const vestibuleLocIndex = project.addLocationToProject('vestibule')
        const leasingLocIndex = project.addLocationToProject('lobby')
        project.addLocationToProject('leasing office')
        const mdfLocIndex = project.addLocationToProject('MDF')
        const idfLocIndex = project.addLocationToProject('IDF')

        console.log('')
        // console.log('------------------------------------------')
        console.log('.............. Adding Zones ..............')
        console.log('')

        const mdfZone = project.addZoneToProject(project.locations[mdfLocIndex]._id)
        const idfZone = project.addZoneToProject(project.locations[idfLocIndex]._id)

        if (mdfZone < 0)
          throw new Error(`MDF zone add failed`)

        if (idfZone < 0)
          throw new Error(`IDF zone add failed`)



        console.log('')
        // console.log('------------------------------------------')
        console.log('........ Adding Location to Zone .........')
        console.log('')

        const locationIdIndexInZone1 = project.addLocationToZone(project.zones[mdfZone]._id, project.locations[mainEntrLocIndex]._id)
        const locationIdIndexInZone2 = project.addLocationToZone(project.zones[mdfZone]._id, project.locations[vestibuleLocIndex]._id)
        const locationIdIndexInZone3 = project.addLocationToZone(project.zones[mdfZone]._id, project.locations[leasingLocIndex]._id)

        if (locationIdIndexInZone1 < 0) throw new Error(`Add location (main entr) to zone failed`)
        if (locationIdIndexInZone2 < 0) throw new Error(`Add location (vestibule) to zone failed`)
        if (locationIdIndexInZone3 < 0) throw new Error(`Add location (vestibule) to zone failed`)

        console.log('')
        // console.log('------------------------------------------')
        console.log('...... Removing Location from Zone .......')
        console.log('')

        if (project.removeLocationFromZone(project.zones[mdfZone]._id, project.locations[vestibuleLocIndex]._id) === null)
          throw new Error(`Remove location (vestibule) failed`)

        else if (project.zones[mdfZone].locations.includes(project.locations[vestibuleLocIndex]._id))
          throw new Error(`Removed location (vestibule) still present`)

        console.log('')
        // console.log('------------------------------------------')
        console.log('........ Adding device to location .......')
        console.log('')

        project.addDeviceToLocation(project.locations[mainEntrLocIndex]._id, project.addedDevicesItems[addedFixedCamIndex]._id)
        project.addDeviceToLocation(project.locations[mainEntrLocIndex]._id, project.addedDevicesItems[addedFixedCam2Index]._id)

        console.log('')
        // console.log('------------------------------------------')
        console.log('...... Removing device from location .....')
        console.log('')

        if (project.removeDeviceFromLocation(project.locations[mainEntrLocIndex]._id, project.addedDevicesItems[addedFixedCam2Index]._id) === null)
          throw new Error(`Remove device (fixed cam) failed`)

        else if (project.locations[mainEntrLocIndex].deviceIds.includes(project.addedDevicesItems[addedFixedCam2Index]._id)) {
          throw new Error(`Removed device (fixed cam) from location still present`)
        }









        console.log('')
        console.log('')
        console.log('------------------------------------------')
        console.log('------------------------------------------')
        console.log('------------------------------------------')
        console.log('')
        console.log('')
        console.log('         Entity Created')



        await this.entitiesDb.asyncInsert(entityObject.formatForDb())

        return

      }

    } catch (e) {
      console.error(`Failed to create dummy entity -> ${e.message}`)
    } finally {
      console.log('')
      console.log('')
      console.log('------------------------------------------')
      console.log('')
      console.log('')

    }
  }
}
