// @ts-nocheck
import express from 'express'
import cors from 'cors'
import { projectHandler } from './ServerHelper/Classes/ProjectHandler.js'

const app = express()
const port = 5000
const ProjectHandler = new projectHandler()


app.use(cors())
app.use(express.json())





app.get('/hydration', async (req, res) => {

  console.log("Hydrated!")
  const projectNamesAndIds = await ProjectHandler.getAndUpdateProjectNamesAndIds()

  return res.status(200).send({ projectNamesAndIds })
})

app.post('/createProject', async (req, res) => {
  const { newProject } = req.body

  console.log("Creating new project with ", newProject)

  const { status, project } = await ProjectHandler.createNewProject(newProject)

  console.log(`Project created`)

  if (status.didFail()) {
    status.printErrorMessage_server();
    return res.status(500).send({ errorMessage: status.getErrorMessage() })
  }

  return res.status(200).send({ project, projectNamesAndIds: ProjectHandler.projectList })
})

app.post('/projectData', async (req, res) => {
  console.log('req body: ', req.body)
  const { projectId } = req.body

  if (projectId === undefined) {
    return res.status(500).send({ errorMessage: `Bad project Id (${projectId})` })
  }

  console.log(`getting project data for ${projectId}`)

  const { status, project } = await ProjectHandler.getProjectData(projectId)

  if (status.didFail()) {
    status.printErrorMessage_server();
    return res.status(500).send({ errorMessage: status.getErrorMessage() })
  }

  return res.status(200).send({ project })
})

app.listen(port, async () => {
  await ProjectHandler.init().catch(e => {
    console.error(`Database fail: ${e.message}`)
  })

  console.log(`Starting server on port [${port}] `)

})