import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type CourseWithModulesDTO } from '@/domain/course-management/enterprise/entities/dtos/course-with-modules'
import { type Course, type Module } from '@prisma/client'

type PrismaCourseWithModules = Course & {
  modules: Module[]
}

export class CourseWithModulesMapper {
  static toDomain(raw: PrismaCourseWithModules): CourseWithModulesDTO {
    // TODO: Make it works after make module mapper

    const courseWithModules: CourseWithModulesDTO = {
      course: {
        id: new UniqueEntityID(raw.id),
        name: raw.name,
        description: raw.description,
        bannerImageKey: raw.bannerImageKey,
        coverImageKey: raw.coverImageKey,
        createdAt: raw.createdAt
      },
      modules: []
    }

    return courseWithModules
  }
}
