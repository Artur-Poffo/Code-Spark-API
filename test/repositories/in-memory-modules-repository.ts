import { type ModulesRepository } from '@/domain/course-management/application/repositories/modules-repository'
import { type Module } from '@/domain/course-management/enterprise/entities/module'
import { type ModuleWithClassesDTO } from './../../src/domain/course-management/enterprise/entities/dtos/module-with-classes'
import { type InMemoryClassesRepository } from './in-memory-classes-repository'

export class InMemoryModulesRepository implements ModulesRepository {
  public items: Module[] = []

  constructor (
    private readonly inMemoryClassesRepository: InMemoryClassesRepository
  ) {}

  async findById(id: string): Promise<Module | null> {
    const module = this.items.find(moduleToCompare => moduleToCompare.id.toString() === id)

    if (!module) {
      return null
    }

    return module
  }

  async findModuleWithClassesById(id: string): Promise<ModuleWithClassesDTO | null> {
    const module = this.items.find(moduleToCompare => moduleToCompare.id.toString() === id)

    if (!module) {
      return null
    }

    const moduleClasses = await this.inMemoryClassesRepository.findManyByModuleId(id)

    const moduleWithClasses: ModuleWithClassesDTO = {
      moduleId: module.id,
      module: {
        name: module.name,
        description: module.description,
        moduleNumber: module.moduleNumber,
        courseId: module.courseId
      },
      classes: moduleClasses
    }

    return moduleWithClasses
  }

  async findManyByCourseId(courseId: string): Promise<Module[]> {
    return this.items.filter(moduleToCompare => moduleToCompare.courseId.toString() === courseId)
  }

  async create(module: Module): Promise<Module> {
    this.items.push(module)
    return module
  }
}
