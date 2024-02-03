import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type DomainEvent } from '@/core/events/domain-event'
import { type Image } from '../entities/image'

export class ImageUploadedEvent implements DomainEvent {
  public image: Image
  public ocurredAt: Date

  constructor(image: Image) {
    this.image = image
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.image.id
  }
}
