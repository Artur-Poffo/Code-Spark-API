import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface CourseProps {
  id: UniqueEntityID
  name: string
  description: string
  coverImageKey?: string | null
  bannerImageKey?: string | null
  createdAt: Date
}

export class Course extends Entity<CourseProps> {
  get id() {
    return this.props.id
  }

  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
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
    id?: UniqueEntityID,
  ) {
    const course = new Course(
      {
        ...props,
        coverImageKey: null,
        bannerImageKey: null,
        createdAt: props.createdAt ?? new Date()
      },
      id,
    )

    return course
  }
}