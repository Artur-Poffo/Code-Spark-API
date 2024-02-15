import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type ModuleWithClassesDTO } from '@/domain/course-management/enterprise/entities/dtos/module-with-classes'
import { type Class, type Module } from '@prisma/client'
import { ClassMapper } from './class-mapper'

type PrismaModuleWithClasses = Module & {
  classes: Class[]
}

export class ModuleWithClassesMapper {
  static toDomain(raw: PrismaModuleWithClasses): ModuleWithClassesDTO {
    const domainClasses = raw.classes.map(classToMap => ClassMapper.toDomain(classToMap))

    const moduleWithClasses: ModuleWithClassesDTO = {
      module: {
        id: new UniqueEntityID(raw.id),
        name: raw.name,
        description: raw.description,
        courseId: new UniqueEntityID(raw.courseId),
        moduleNumber: raw.moduleNumber
      },
      classes: domainClasses
    }

    return moduleWithClasses
  }
}
