import { type ClassesRepository } from '@/domain/course-management/application/repositories/classes-repository'
import { type Class } from '@/domain/course-management/enterprise/entities/class'

export class InMemoryClassesRepository implements ClassesRepository {
  public items: Class[] = []

  async findById(id: string): Promise<Class | null> {
    const classToSearch = this.items.find(classToCompare => classToCompare.id.toString() === id)

    if (!classToSearch) {
      return null
    }

    return classToSearch
  }

  async findManyByModuleId(moduleId: string): Promise<Class[]> {
    return this.items.filter(classToCompare => classToCompare.moduleId.toString() === moduleId)
  }

  async create(classToAdd: Class): Promise<Class> {
    this.items.push(classToAdd)
    return classToAdd
  }
}
