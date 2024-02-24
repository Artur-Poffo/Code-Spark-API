import { type Module } from '../../module'
import { type ModuleDTO } from '../module'

export class ModuleDtoMapper {
  static toDTO(module: Module): ModuleDTO {
    return {
      id: module.id,
      name: module.name,
      description: module.description,
      moduleNumber: module.moduleNumber,
      courseId: module.courseId
    }
  }
}
