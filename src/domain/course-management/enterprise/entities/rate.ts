import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'

export interface RateProps {
  value: number
  userId: UniqueEntityID
  courseId?: UniqueEntityID
  classId?: UniqueEntityID
  createdAt: Date
}

export class Rate extends Entity<RateProps> {
  get value() {
    return this.props.value
  }

  get userId() {
    return this.props.userId
  }

  get courseId() {
    return this.props.courseId
  }

  get classId() {
    return this.props.classId
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<RateProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {
    const rate = new Rate(
      {
        ...props,
        createdAt: props.createdAt ?? new Date()
      },
      id
    )

    return rate
  }
}
