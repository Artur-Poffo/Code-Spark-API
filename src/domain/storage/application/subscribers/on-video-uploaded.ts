import { DomainEvents } from '@/core/events/domain-events'
import { type EventHandler } from '@/core/events/event-handler'
import { VideoUploadedEvent } from '@/domain/course-management/enterprise/events/video-uploaded'
import { type UploadFileUseCase } from '../use-cases/upload-file'

export class OnVideoUploaded implements EventHandler {
  constructor(
    private readonly uploadFileUseCase: UploadFileUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.uploadVideo.bind(this) as (event: unknown) => void,
      VideoUploadedEvent.name
    )
  }

  private async uploadVideo({ video }: VideoUploadedEvent) {
    console.log('olá')

    await this.uploadFileUseCase.exec({
      fileName: video.videoName,
      fileType: video.videoType,
      body: video.body,
      size: video.size,
      storedAt: video.storedAt
    })
  }
}
