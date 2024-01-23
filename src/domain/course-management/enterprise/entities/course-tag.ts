import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface CourseTagProps {
  id: UniqueEntityID
  courseId: UniqueEntityID,
  tagId: UniqueEntityID
}

export class CourseTag extends Entity<CourseTagProps> {
  get id() {
    return this.props.id
  }

  get courseId() {
    return this.props.courseId
  }

  get tagId() {
    return this.props.tagId
  }

  static create(
    props: CourseTagProps,
    id?: UniqueEntityID,
  ) {
    const courseTag = new CourseTag(
      {
        ...props,
      },
      id,
    )

    return courseTag
  }
}