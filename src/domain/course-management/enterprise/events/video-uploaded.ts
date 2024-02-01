import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type DomainEvent } from '@/core/events/domain-event'
import { type Video } from '../entities/video'

export class VideoUploadedEvent implements DomainEvent {
  public video: Video
  public ocurredAt: Date

  constructor(video: Video) {
    this.video = video
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.video.id
  }
}
