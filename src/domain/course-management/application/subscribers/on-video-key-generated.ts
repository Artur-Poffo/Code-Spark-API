import { DomainEvents } from '@/core/events/domain-events'
import { type EventHandler } from '@/core/events/event-handler'
import { VideoKeyGeneratedEvent } from '@/domain/storage/enterprise/events/video-key-generated'
import { type VideosRepository } from '../repositories/videos-repository'

export class OnVideoKeyGenerated implements EventHandler {
  constructor(
    private readonly videosRepository: VideosRepository
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.appendVideoKey.bind(this) as (event: unknown) => void,
      VideoKeyGeneratedEvent.name
    )
  }

  private async appendVideoKey({ file, video }: VideoKeyGeneratedEvent) {
    console.log('dwadwa')

    await this.videosRepository.appendVideoKey(file.fileKey, video.id.toString())
  }
}
