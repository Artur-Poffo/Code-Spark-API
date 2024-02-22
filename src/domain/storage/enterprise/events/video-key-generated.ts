import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type DomainEvent } from '@/core/events/domain-event'
import { type Video } from '@/domain/course-management/enterprise/entities/video'
import { type File } from '../entities/file'

export class VideoKeyGeneratedEvent implements DomainEvent {
  public file: File
  public video: Video
  public ocurredAt: Date

  constructor(file: File, video: Video) {
    this.file = file
    this.video = video
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.file.id
  }
}
