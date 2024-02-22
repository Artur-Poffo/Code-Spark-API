import { DomainEvents } from '@/core/events/domain-events'
import { type EventHandler } from '@/core/events/event-handler'
import { ImageUploadedEvent } from '@/domain/course-management/enterprise/events/image-uploaded'
import { type UploadFileUseCase } from '../use-cases/upload-file'

export class OnImageUploaded implements EventHandler {
  constructor(
    private readonly uploadFileUseCase: UploadFileUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.uploadImage.bind(this) as (event: unknown) => void,
      ImageUploadedEvent.name
    )
  }

  private async uploadImage({ image }: ImageUploadedEvent) {
    const result = await this.uploadFileUseCase.exec({
      fileName: image.imageName,
      fileType: image.imageType,
      body: image.body,
      size: image.size,
      storedAt: image.storedAt
    })

    if (result.isRight()) {
      const { file } = result.value
      file.addImageDomainEvent(file, image)

      DomainEvents.dispatchEventsForAggregate(file.id)
    }
  }
}
