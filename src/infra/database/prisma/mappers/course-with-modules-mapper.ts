import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type CourseWithModulesDTO } from '@/domain/course-management/enterprise/entities/dtos/course-with-modules'
import { type Course, type Module } from '@prisma/client'
import { ModuleMapper } from './module-mapper'

type PrismaCourseWithModules = Course & {
  modules: Module[]
}

export class CourseWithModulesMapper {
  static toDomain(raw: PrismaCourseWithModules): CourseWithModulesDTO {
    const domainModules = raw.modules.map(module => ModuleMapper.toDomain(module))

    const courseWithModules: CourseWithModulesDTO = {
      course: {
        id: new UniqueEntityID(raw.id),
        name: raw.name,
        description: raw.description,
        bannerImageKey: raw.bannerImageKey,
        coverImageKey: raw.coverImageKey,
        createdAt: raw.createdAt
      },
      modules: domainModules
    }

    return courseWithModules
  }
}
