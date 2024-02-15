import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type CompleteCourseDTO } from '@/domain/course-management/enterprise/entities/dtos/complete-course'
import { type Class, type Course, type Module, type User } from '@prisma/client'
import { InstructorMapper } from './instructor-mapper'

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

    // TODO: Make it works after make module with classes mapper

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
      modules: []
    }

    return completeCourse
  }
}
