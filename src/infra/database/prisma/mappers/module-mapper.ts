import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Module } from '@/domain/course-management/enterprise/entities/module'
import { type Prisma, type Module as PrismaModule } from '@prisma/client'
import { type ClassesRepository } from './../../../../domain/course-management/application/repositories/classes-repository'

export class ModuleMapper {
  constructor(
    private readonly classesRepository: ClassesRepository
  ) {}

  static toDomain(raw: PrismaModule): Module {
    return Module.create(
      {
        name: raw.name,
        description: raw.description,
        courseId: new UniqueEntityID(raw.courseId),
        moduleNumber: raw.moduleNumber
      },
      new UniqueEntityID(raw.id)
    )
  }

  async toPrisma(module: Module): Promise<Prisma.ModuleUncheckedCreateInput> {
    const moduleClasses = await this.classesRepository.findManyByModuleId(module.id.toString())

    return {
      id: module.id.toString(),
      name: module.name,
      description: module.description,
      courseId: module.courseId.toString(),
      moduleNumber: module.moduleNumber,
      classes: {
        connect: moduleClasses.map(classToMap => ({ id: classToMap.id.toString() }))
      }
    }
  }
}
