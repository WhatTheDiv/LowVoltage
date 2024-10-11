import { Project } from "../Classes/Project"
import { appErrorMessage } from "../../app"


export async function HydrateProjects(projectList) {
  if (projectList.length < 1) return []

  return projectList.map((project, index) => {
    return new Project(project.name, project.id, project.creationDate)
  })
}

