import { v4 as uuidv4 } from 'uuid'
import Status from '../../client/helper/Status.mjs';


export class materialHandler {
  constructor() {
    this.db = {}
  }
  assignDb(db) {
    this.db = db
  }

  async hydrateMaterials(materialArr, status) {
    if (!materialArr || !Array.isArray(materialArr))
      status.error(`Invalid material list`)

    else if (materialArr.length < 1) {
      console.log(`No material list to hydrate`)
      return []
    }

    // pull materials from database
    const materials = await this.db.asyncFind({
      $or:
        materialArr.map(m => ({ _id: m._id }))

    })

    // throw error if no material hydrated
    if (!materials || materials.length < 1) {
      status.error(`Materials not found`)
    }

    // otherwise replace device list in project with hydrated version
    return materials
  }

  async addNewMaterialInList(materialList = [], _status) {
    const activeStatus = _status ? true : false
    const status = activeStatus ? _status : new Status()

    const trimmedMaterialList = []
    const allNewMaterials = []
    const hydratedMaterialList = []

    if (!Array.isArray(materialList)) status.error('Bad array, addNewMaterialInList')

    for (let index = 0; index < materialList.length; index++) {
      const material = materialList[index]
      await this.db.asyncFindOne({ name: material.name, category: material.category }).then(m => {
        if (m) {
          console.log(`material (${m.name}), category (${m.category}), exists.`)
          trimmedMaterialList.push({ name: m.name, _id: m._id })
          hydratedMaterialList.push(m)
        }
        else {
          console.log(`material (${material.name}) does not exist, adding.`)
          material._id = uuidv4()
          allNewMaterials.push({ index, material })
        }
      }).catch(e => {
        status.softError(`Error looking for material ${index + 1} - ${material.name}, not adding - ${e.message}`)
      })
    }

    if (allNewMaterials.length > 0) {
      await this.db.asyncInsert(allNewMaterials.map(obj => obj.material)).then(docs => {
        if (Array.isArray(docs)) {
          docs.forEach(m => {
            trimmedMaterialList.push({ name: m.name, _id: m._id })
            hydratedMaterialList.push(m)
          });
        }
        else status.error(`Should have added new material but didnt`)
      }).catch(e => {
        status.error(`Failed to add ${allNewMaterials.length} materials - ${e.message}`)
      })

    }

    return { trimmedMaterialList, hydratedMaterialList }
  }
}