import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CourseTag } from '@/domain/course-management/enterprise/entities/course-tag'
import { type Prisma, type CourseTag as PrismaCourseTag } from '@prisma/client'

export class CourseTagMapper {
  static toDomain(raw: PrismaCourseTag): CourseTag {
    return CourseTag.create(
      {
        courseId: new UniqueEntityID(raw.courseId),
        tagId: new UniqueEntityID(raw.tagId),
        attachedAt: raw.attachedAt
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(courseTag: CourseTag): Prisma.CourseTagUncheckedCreateInput {
    return {
      id: courseTag.id.toString(),
      courseId: courseTag.courseId.toString(),
      tagId: courseTag.tagId.toString(),
      attachedAt: courseTag.attachedAt
    }
  }
}
