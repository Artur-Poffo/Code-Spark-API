import { type ModulesRepository } from '@/domain/course-management/application/repositories/modules-repository'
import { type Module } from '@/domain/course-management/enterprise/entities/module'

export class InMemoryModulesRepository implements ModulesRepository {
  public items: Module[] = []

  async findById(id: string): Promise<Module | null> {
    const module = this.items.find(moduleToCompare => moduleToCompare.id.toString() === id)

    if (!module) {
      return null
    }

    return module
  }

  async findManyByCourseId(courseId: string): Promise<Module[]> {
    return this.items.filter(moduleToCompare => moduleToCompare.courseId.toString() === courseId)
  }

  async create(module: Module): Promise<Module> {
    this.items.push(module)
    return module
  }
}
