import { AggregateRoot } from '@/core/entities/aggregate-root'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'
import { ImageUploadedEvent } from '../events/image-uploaded'

export interface ImageProps {
  imageName: string
  imageType: 'image/jpeg' | 'image/png'
  body: Buffer
  size: number
  imageKey?: string
  storedAt: Date
}

export class Image extends AggregateRoot<ImageProps> {
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

    const isNewImage = !id

    if (isNewImage) {
      image.addDomainEvent(new ImageUploadedEvent(image))
    }

    return image
  }
}
