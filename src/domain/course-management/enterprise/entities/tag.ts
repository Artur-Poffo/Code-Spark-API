import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'

export interface TagProps {
  value: string
  addedAt: Date
}

export class Tag extends Entity<TagProps> {
  get value() {
    return this.props.value
  }

  get addedAt() {
    return this.props.addedAt
  }

  static create(
    props: Optional<TagProps, 'addedAt'>,
    id?: UniqueEntityID
  ) {
    const tag = new Tag(
      {
        addedAt: new Date(),
        ...props
      },
      id
    )

    return tag
  }
}
