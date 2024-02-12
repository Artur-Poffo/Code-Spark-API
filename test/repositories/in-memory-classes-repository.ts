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
    return this.items
      .filter(classToCompare => classToCompare.moduleId.toString() === moduleId)
      .sort((a, b) => a.classNumber - b.classNumber)
  }

  async create(classToAdd: Class): Promise<Class> {
    this.items.push(classToAdd)
    return classToAdd
  }

  async save(classToEdit: Class): Promise<void> {
    const classIndex = this.items.indexOf(classToEdit)
    this.items[classIndex] = classToEdit
  }

  async delete(classToDelete: Class): Promise<void> {
    const classIndex = this.items.indexOf(classToDelete)
    this.items.splice(classIndex, 1)
  }
}
