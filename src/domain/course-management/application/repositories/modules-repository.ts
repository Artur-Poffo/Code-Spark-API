import { type Module } from '../../enterprise/entities/module'

export interface ModulesRepository {
  findById: (id: string) => Promise<Module | null>
  findManyByCourseId: (id: string) => Promise<Module[]>
  create: (module: Module) => Promise<Module>
}
