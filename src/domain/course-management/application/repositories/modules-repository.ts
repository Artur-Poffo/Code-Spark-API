import { type Module } from '../../enterprise/entities/module'

export interface ModulesRepository {
  findById: (id: string) => Promise<Module | null>
  create: (module: Module) => Promise<Module>
}
