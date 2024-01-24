import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface TagProps {
  value: string
}

export class Tag extends Entity<TagProps> {
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
