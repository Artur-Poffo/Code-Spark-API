import { type ClassesRepository } from '@/domain/course-management/application/repositories/classes-repository'
import { type Class } from '@/domain/course-management/enterprise/entities/class'
import { prisma } from '..'
import { ClassMapper } from '../mappers/class-mapper'

export class PrismaClassesRepository implements ClassesRepository {
  constructor(
    private readonly classMapper: ClassMapper
  ) {}

  async findById(id: string): Promise<Class | null> {
    const classToFind = await prisma.class.findUnique({
      where: {
        id
      }
    })

    if (!classToFind) {
      return null
    }

    const domainClass = ClassMapper.toDomain(classToFind)

    return domainClass
  }

  async findManyByModuleId(moduleId: string): Promise<Class[]> {
    const classesToFind = await prisma.class.findMany({
      where: {
        moduleId
      },
      orderBy: {
        classNumber: 'asc'
      }
    })

    const domainClasses = classesToFind.map(classToMap => ClassMapper.toDomain(classToMap))

    return domainClasses
  }

  async create(classToAdd: Class): Promise<Class> {
    const infraClass = await this.classMapper.toPrisma(classToAdd)

    await prisma.class.create({
      data: infraClass
    })

    return classToAdd
  }

  async save(classToSave: Class): Promise<void> {
    const infraClass = await this.classMapper.toPrisma(classToSave)

    await prisma.class.update({
      where: {
        id: infraClass.id
      },
      data: infraClass
    })
  }

  async delete(classToDelete: Class): Promise<void> {
    await prisma.class.delete({
      where: {
        id: classToDelete.id.toString()
      }
    })
  }
}
