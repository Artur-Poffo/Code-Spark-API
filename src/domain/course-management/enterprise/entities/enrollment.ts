import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'

export interface EnrollmentProps {
  studentId: UniqueEntityID
  courseId: UniqueEntityID
  ocurredAt: Date
  completedAt?: Date | null
}

export class Enrollment extends Entity<EnrollmentProps> {
  get studentId() {
    return this.props.studentId
  }

  get courseId() {
    return this.props.courseId
  }

  get ocurredAt() {
    return this.props.ocurredAt
  }

  get completedAt() {
    return this.props.completedAt
  }

  set completedAt(completedAt) {
    this.props.completedAt = completedAt
  }

  static create(
    props: Optional<EnrollmentProps, 'ocurredAt'>,
    id?: UniqueEntityID
  ) {
    const enrollment = new Enrollment(
      {
        ...props,
        ocurredAt: props.ocurredAt ?? new Date()
      },
      id
    )

    return enrollment
  }
}
