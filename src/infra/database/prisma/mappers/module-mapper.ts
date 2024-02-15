import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Module } from '@/domain/course-management/enterprise/entities/module'
import { type Prisma, type Module as PrismaModule } from '@prisma/client'

export class ModuleMapper {
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

  static toPrisma(module: Module): Prisma.ModuleUncheckedCreateInput {
    return {
      id: module.id.toString(),
      name: module.name,
      description: module.description,
      courseId: module.courseId.toString(),
      moduleNumber: module.moduleNumber
    }
  }
}
