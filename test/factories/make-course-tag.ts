import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CourseTag, type CourseTagProps } from '@/domain/course-management/enterprise/entities/course-tag'

export function makeCourseTag(
  override: Partial<CourseTagProps> = {},
  id?: UniqueEntityID
) {
  const courseTag = CourseTag.create(
    {
      courseId: override.courseId ?? new UniqueEntityID(),
      tagId: override.tagId ?? new UniqueEntityID(),
      attachedAt: override.attachedAt ?? new Date(),
      ...override
    },
    id
  )

  return courseTag
}
