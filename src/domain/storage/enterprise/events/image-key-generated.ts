import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type DomainEvent } from '@/core/events/domain-event'
import { type Image } from '@/domain/course-management/enterprise/entities/image'
import { type File } from '../entities/file'

export class ImageKeyGeneratedEvent implements DomainEvent {
  public file: File
  public image: Image
  public ocurredAt: Date

  constructor(file: File, image: Image) {
    this.file = file
    this.image = image
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.file.id
  }
}
