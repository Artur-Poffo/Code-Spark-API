import { DomainEvents } from '@/core/events/domain-events'
import { type EventHandler } from '@/core/events/event-handler'
import { ImageKeyGeneratedEvent } from '@/domain/storage/enterprise/events/image-key-generated'
import { type ImagesRepository } from '../repositories/images-repository'

export class OnImageKeyGenerated implements EventHandler {
  constructor(
    private readonly imagesRepository: ImagesRepository
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.appendImageKey.bind(this) as (event: unknown) => void,
      ImageKeyGeneratedEvent.name
    )
  }

  private async appendImageKey({ file, image }: ImageKeyGeneratedEvent) {
    await this.imagesRepository.appendImageKey(file.fileKey, image.id.toString())
  }
}
