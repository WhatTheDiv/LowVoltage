// @ts-nocheck
import express from 'express'
import cors from 'cors'
import { entityHandler } from './ServerHelper/Classes/EntityHandler.js'
import Status from './client/helper/Status.mjs'

const app = express()
const port = 5000
const EntityHandler = new entityHandler()
const dummy = {
  dummyEntity: true,
  dummyProject: true,
  dummyDevicesandLocations: true,
}


app.use(cors())
app.use(express.json())





app.post('/hydration', async (req, res) => {
  // const { entityName } = req.body


  // if (!entityId)
  //   return res.status(500).send({
  //     errorMessage: `No entity ID given`
  //   })

  const { allProjectNamesAndIds, entity, errorMessage } = await EntityHandler.getEntityObject_name('firstEntity')
    .then(async entityObject => ({
      allProjectNamesAndIds: entityObject.getProjectNamesAndIds().allProjectNamesAndIds,
      entity: entityObject.formatForDb()
    }))
    .catch(e => ({ errorMessage: `Error getting projects ... ${e}` }))

  if (errorMessage) {
    console.error(errorMessage)
    return res.status(500).send({ errorMessage })
  }

  console.log({ allProjectNamesAndIds })

  return res.status(200).send({ allProjectNamesAndIds, entity })
})

app.post('/createProject', async (req, res) => {
  const { projDetails } = req.body

  console.log("Creating new project with ", projDetails)

  if (!projDetails)
    return res.status(500).send({ errorMessage: `Missing project details (${projDetails})` })

  const { newProject, allProjectNamesAndIds, errorMessage } = await EntityHandler.getEntityObject_name('firstEntity')
    .then(async entityObject => {
      const newProjectIndex = entityObject.createNewProject(projDetails)
      const project = entityObject.entityProjects[newProjectIndex].formatForDb()
      await entityObject.saveProjects()
      const { allProjectNamesAndIds } = entityObject.getProjectNamesAndIds()

      return {
        newProject: project,
        allProjectNamesAndIds
      }
    }).catch(e =>
      ({ errorMessage: `Error creating project - ${e.message}` })
    )
  console.log({ allProjectNamesAndIds })

  if (errorMessage)
    return res.status(500).send({ errorMessage })

  return res.status(200).send({ newProject, allProjectNamesAndIds })
})

app.post('/projectData', async (req, res) => {
  const { projectId, entityId } = req.body

  if (projectId === undefined) {
    return res.status(500).send({ errorMessage: `Bad project Id (${projectId})` })
  }

  // const project = getDummyData()
  const { project, simpleGlobalDevices, usedDevices, errorMessage } = await EntityHandler.getEntityObject_name('firstEntity')
    .then(entityObject => {
      const Project = (entityObject.getProjectObject_id(projectId))
      const usedDeviceIds = Project.getUsedDevices()

      return {
        project: Project.formatForDb(),
        // usedDevices: entityObject.entityDevices
        //   .filter(device => usedDeviceIds.includes(device._id))
        //   .map(d => d.formatForDb()),
        usedDevices: entityObject.getUsedDeviceList(Project),
        simpleGlobalDevices: entityObject.getSimpleDeviceList()
      }
    })
    .catch(e => ({ errorMessage: `Error retrieving project data - ${e.message}` }))

  if (errorMessage)
    return res.status(500).send({ errorMessage })

  return res.status(200).send({ project, simpleGlobalDevices, usedDevices })
})

app.post('/updateProject', async (req, res) => {
  const { projectId, newZone, newLocation } = req.body
  // newZone = { name, locationId? }

  console.log('Body of request in /updateProject: ', req.body)

  if (!projectId)
    return res.status(500).send({ errorMessage: 'Bad project ID' })

  const { errorMessage, project, simpleGlobalDevices, usedDevices } = await EntityHandler
    .getEntityObject_name('firstEntity')
    .then(entityObject => {
      const Project = entityObject.getProjectObject_id(projectId)


      // Create new zone 
      if (newZone) {
        // get index of location
        const locationIndex = !newZone.locationId
          ? Project.addLocationToProject(newZone.name)
          : Project.locations.findIndex(loc => loc._id === newZone.locationId)

        // error handle
        if (locationIndex < 0) {
          const message = !newZone.locationId
            ? `Failed to create location`
            : `Could not find location (${locationId})`
          throw new Error(`New Zone failed - ${message}`)
        }

        const zoneIndex = Project.addZoneToProject(Project.locations[locationIndex]._id)

        if (zoneIndex < 0) {
          throw new Error(`Failed to add zone to project`)
        }
      }

      // Create new location
      if (newLocation) {
        const locationIndex = Project.addLocationToProject(newLocation.name)


        // error handle
        if (locationIndex < 0)
          throw new Error(`Failed to create location`)

        // Add location to zone
        if (newLocation.zoneId)
          console.log('added to zone: ', Project.addLocationToZone(newLocation.zoneId, Project.locations[locationIndex]._id))
      }


      const simpleGlobalDevices = entityObject.getSimpleDeviceList()
      const usedDevices = entityObject.getUsedDeviceList(Project)
      entityObject.saveProjects()

      return {
        project: Project.formatForDb(),
        simpleGlobalDevices,
        usedDevices
      }
    }).catch(e =>
      ({ errorMessage: `${e.message}` })
    )

  if (errorMessage) {
    console.error(errorMessage)
    return res.status(500).send({ errorMessage })
  }

  return res.status(200).send({ project, simpleGlobalDevices, usedDevices })
})

app.listen(port, async () => {
  await EntityHandler.init(dummy).catch(e => {
    console.error(`Database fail: ${e.message}`)
  })

  console.log(`Starting server on port [${port}] `)
})

const getDummyData = () => {
  /*
  
  Entities[entityId] = {
    _id,
    entityDetails: {},
    entityDevices: [
      { 
        _id, 
        name, 
        description, 
        manufacturer,
        model, 
        color, 
        networked, 
        powerInput, 
        category, 
        subcategory, 
        url, 
        iconType, 
        iconColor 
      }
    ], 
    entityProjects: [
      { 
        _id,
        addedDevicesItems: [],
        locations: [],
        zones: [],
        materials: [],
        details: { 
          name, 
          street, 
          city, 
          zip, 
          state, 
          group, 
          propertyContacts: [
            { 
              fname, 
              lname, 
              phone, 
              email, 
              title 
            }
          ]
        }
      }
    ]
  }
  
  */
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
      _id: "100",
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
      _id: "101",
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
      _id: "102",
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
      _id: "103",
    },
  ];
  const _usedDevices = ['100', '101', '102', '103']

  const globalDevices = _globalDevices.map(globalDevice => ({ name: globalDevice.name, _id: globalDevice._id, category: globalDevice.category }))
  const usedDevices = _globalDevices.filter(globalDevice => _usedDevices.includes(globalDevice._id));
  const devices = [
    {
      _id: "1",
      _deviceId: "100",
      category: "cctv",
      locationId: "1",
      controllerId: "",
      childIds: [],
    },
    {
      _id: "2",
      _deviceId: "100",
      category: "cctv",
      locationId: "2",
      controllerId: "",
      childIds: [],
    },
    {
      _id: "3",
      _deviceId: "100",
      category: "cctv",
      locationId: "3",
      controllerId: "",
      childIds: [],
    },
    {
      _id: "4",
      _deviceId: "100",
      category: "cctv",
      locationId: "4",
      controllerId: "",
      childIds: [],
    },
    {
      _id: "5",
      _deviceId: "100",
      category: "cctv",
      locationId: "5",
      controllerId: "",
      childIds: [],
    },
    {
      _id: "6",
      _deviceId: "103",
      category: "ac",
      locationId: "1",
      controllerId: "",
      childIds: [],
    },
  ];
  const locations = [
    { _id: "1", name: "main entrance", headId: "2", deviceIds: ["1", "6"] },
    { _id: "2", name: "vestibule", headId: "2", deviceIds: ["2"] },
    { _id: "3", name: "lobby", headId: "1", deviceIds: ["3"] },
    { _id: "4", name: "concierge desk", headId: "1", deviceIds: ["4"] },
    { _id: "5", name: "leasing office", headId: "1", deviceIds: ["5"] },
    { _id: "6", name: "MDF", headId: "1", deviceIds: [] },
    { _id: "7", name: "IDF", headId: "2", deviceIds: [] },
  ];
  const zones = [
    { _id: "1", locationId: "6", locations: ["3", "4"] },
    { _id: "2", locationId: "7", locations: ["1", "2", "5"] },
  ];
  const materials = []
  const _id = '1'
  const details = {
    name: 'firstProject',
    street: 123,
    city: 'city',
    zip: '12345',
    state: 'ny',
    group: 'none',
  }


  return {
    _id, details, globalDevices, usedDevices, devices, locations, zones, materials
  }
}