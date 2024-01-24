import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'

export interface CourseProps {
  name: string
  description: string
  instructorId: UniqueEntityID
  coverImageKey?: string | null
  bannerImageKey?: string | null
  createdAt: Date
}

export class Course extends Entity<CourseProps> {
  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get instructorId() {
    return this.props.instructorId
  }

  get coverImageKey() {
    return this.props.coverImageKey
  }

  get bannerImageKey() {
    return this.props.bannerImageKey
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<CourseProps, 'createdAt' | 'coverImageKey' | 'bannerImageKey'>,
    id?: UniqueEntityID
  ) {
    const course = new Course(
      {
        ...props,
        coverImageKey: null,
        bannerImageKey: null,
        createdAt: props.createdAt ?? new Date()
      },
      id
    )

    return course
  }
}
