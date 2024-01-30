import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'

export interface CourseTagProps {
  courseId: UniqueEntityID
  tagId: UniqueEntityID
  attachedAt: Date
}

export class CourseTag extends Entity<CourseTagProps> {
  get courseId() {
    return this.props.courseId
  }

  get tagId() {
    return this.props.tagId
  }

  static create(
    props: Optional<CourseTagProps, 'attachedAt'>,
    id?: UniqueEntityID
  ) {
    const courseTag = new CourseTag(
      {
        attachedAt: props.attachedAt ?? new Date(),
        ...props
      },
      id
    )

    return courseTag
  }
}
