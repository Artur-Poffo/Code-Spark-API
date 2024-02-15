import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type CompleteCourseDTO } from '@/domain/course-management/enterprise/entities/dtos/complete-course'
import { type Class, type Course, type Module, type User } from '@prisma/client'
import { InstructorMapper } from './instructor-mapper'
import { ModuleWithClassesMapper } from './module-with-classes-mapper'

type PrismaCompleteCourse = Course & {
  instructor: User
} & {
  modules: Array<Module & {
    classes: Class[]
  }>
}

export class CompleteCourseMapper {
  static toDomain(raw: PrismaCompleteCourse): CompleteCourseDTO {
    const domainInstructor = InstructorMapper.toDomain(raw.instructor)

    const domainModulesWithClasses = raw.modules.map(module => ModuleWithClassesMapper.toDomain(module))

    const completeCourse: CompleteCourseDTO = {
      course: {
        id: new UniqueEntityID(raw.id),
        name: raw.name,
        description: raw.description,
        bannerImageKey: raw.bannerImageKey,
        coverImageKey: raw.coverImageKey,
        createdAt: raw.createdAt
      },
      instructor: domainInstructor,
      modules: domainModulesWithClasses
    }

    return completeCourse
  }
}
