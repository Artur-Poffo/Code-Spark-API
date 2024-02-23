import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'

export interface ImageProps {
  imageName: string
  imageType: 'image/jpeg' | 'image/png'
  body: Buffer
  size: number
  imageKey?: string | null
  storedAt: Date
}

export class Image extends Entity<ImageProps> {
  get imageName() {
    return this.props.imageName
  }

  get imageType() {
    return this.props.imageType
  }

  get body() {
    return this.props.body
  }

  get size() {
    return this.props.size
  }

  get imageKey() {
    return this.props.imageKey
  }

  set imageKey(imageKeyToAppend) {
    this.props.imageKey = imageKeyToAppend
  }

  get storedAt() {
    return this.props.storedAt
  }

  static create(
    props: Optional<ImageProps, 'storedAt' | 'imageType'>,
    id?: UniqueEntityID
  ) {
    const image = new Image(
      {
        imageType: props.imageType ?? 'image/jpeg',
        storedAt: props.storedAt ?? new Date(),
        ...props
      },
      id
    )

    return image
  }
}
