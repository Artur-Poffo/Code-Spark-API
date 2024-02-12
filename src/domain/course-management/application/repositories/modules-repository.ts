import { type Class } from '../../enterprise/entities/class'
import { type Module } from '../../enterprise/entities/module'
import { type ModuleWithClassesDTO } from './../../enterprise/entities/dtos/module-with-classes'

export interface ModulesRepository {
  findById: (id: string) => Promise<Module | null>
  findManyByCourseId: (id: string) => Promise<Module[]>
  findManyClassesByCourseId: (courseId: string) => Promise<Class[]>
  findModuleWithClassesById: (id: string) => Promise<ModuleWithClassesDTO | null>
  create: (module: Module) => Promise<Module>
  save: (module: Module) => Promise<void>
  delete: (module: Module) => Promise<void>
}
