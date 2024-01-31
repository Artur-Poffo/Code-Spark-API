import { type ClassesRepository } from '@/domain/course-management/application/repositories/classes-repository'
import { type Class } from '@/domain/course-management/enterprise/entities/class'
import { type InMemoryModulesRepository } from './in-memory-modules-repository'

export class InMemoryClassesRepository implements ClassesRepository {
  public items: Class[] = []

  constructor(private readonly inMemoryModulesRepository: InMemoryModulesRepository) {}

  async findById(id: string): Promise<Class | null> {
    const classToSearch = this.items.find(classToCompare => classToCompare.id.toString() === id)

    if (!classToSearch) {
      return null
    }

    return classToSearch
  }

  async findManyByCourseId(courseId: string): Promise<Class[]> {
    const courseModules = await this.inMemoryModulesRepository.findManyByCourseId(courseId)
    const courseModulesIds = courseModules.map(moduleToMap => moduleToMap.id.toString())
    const classes = this.items.filter(classToCompare => courseModulesIds.includes(classToCompare.moduleId.toString()))

    return classes
  }

  async findManyByModuleId(moduleId: string): Promise<Class[]> {
    return this.items.filter(classToCompare => classToCompare.moduleId.toString() === moduleId)
  }

  async create(classToAdd: Class): Promise<Class> {
    this.items.push(classToAdd)
    return classToAdd
  }
}
