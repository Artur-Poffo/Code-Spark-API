import { type Module } from '../../enterprise/entities/module'
import { type ModuleWithClassesDTO } from './../../enterprise/entities/dtos/module-with-classes'

export interface ModulesRepository {
  findById: (id: string) => Promise<Module | null>
  findManyByCourseId: (id: string) => Promise<Module[]>
  findModuleWithClassesById: (id: string) => Promise<ModuleWithClassesDTO | null>
  create: (module: Module) => Promise<Module>
}
