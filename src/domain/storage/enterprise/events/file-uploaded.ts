import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type DomainEvent } from '@/core/events/domain-event'
import { type File } from '../entities/file'

export class FileUploadedEvent implements DomainEvent {
  public file: File
  public ocurredAt: Date

  constructor(file: File) {
    this.file = file
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.file.id
  }
}
