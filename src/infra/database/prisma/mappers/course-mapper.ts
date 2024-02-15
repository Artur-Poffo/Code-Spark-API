import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Course } from '@/domain/course-management/enterprise/entities/course'
import { type Prisma, type Course as PrismaCourse } from '@prisma/client'

export class CourseMapper {
  static toDomain(raw: PrismaCourse): Course {
    return Course.create(
      {
        name: raw.name,
        description: raw.description,
        instructorId: new UniqueEntityID(raw.instructorId),
        bannerImageKey: raw.bannerImageKey,
        coverImageKey: raw.coverImageKey,
        createdAt: raw.createdAt
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(course: Course): Prisma.CourseUncheckedCreateInput {
    return {
      id: course.id.toString(),
      name: course.name,
      description: course.description,
      instructorId: course.instructorId.toString(),
      bannerImageKey: course.bannerImageKey,
      coverImageKey: course.coverImageKey,
      createdAt: course.createdAt
    }
  }
}
