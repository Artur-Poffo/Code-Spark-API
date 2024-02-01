import { DomainEvents } from '@/core/events/domain-events'
import { type EventHandler } from '@/core/events/event-handler'
import { type VideosRepository } from '@/domain/course-management/application/repositories/videos-repository'
import { VideoUploadedEvent } from '@/domain/course-management/enterprise/events/video-uploaded'
import { type UploadFileUseCase } from '../use-cases/upload-file'

export class OnVideoUploaded implements EventHandler {
  constructor(
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly videosRepository: VideosRepository
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
    const result = await this.uploadFileUseCase.exec({
      fileName: video.videoName,
      fileType: video.videoType,
      body: video.body,
      size: video.size,
      storedAt: video.storedAt
    })

    if (result.isRight()) {
      const { fileKey } = result.value.file

      await this.videosRepository.appendVideoKey(fileKey, video.id.toString())
    }
  }
}
