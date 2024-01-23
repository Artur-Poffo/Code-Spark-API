import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface TagProps {
  id: UniqueEntityID
  value: string
}

export class Tag extends Entity<TagProps> {
  get id() {
    return this.props.id
  }

  get value() {
    return this.props.value
  }

  static create(
    props: TagProps,
    id?: UniqueEntityID
  ) {
    const tag = new Tag(
      {
        ...props
      },
      id
    )

    return tag
  }
}
