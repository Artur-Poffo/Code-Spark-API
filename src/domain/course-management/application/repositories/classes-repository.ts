import { type Class } from '../../enterprise/entities/class'

export interface ClassesRepository {
  findById: (id: string) => Promise<Class | null>
  findManyByModuleId: (moduleId: string) => Promise<Class[]>
  create: (classToAdd: Class) => Promise<Class>
}
