import { DomainEvents } from '@/core/events/domain-events'
import { type EventHandler } from '@/core/events/event-handler'
import { FileUploadedEvent } from '@/domain/storage/enterprise/events/file-uploaded'
import { Image } from '../../enterprise/entities/image'
import { Video } from '../../enterprise/entities/video'
import { type ImagesRepository } from '../repositories/images-repository'
import { type VideosRepository } from '../repositories/videos-repository'

export class OnFileUploaded implements EventHandler {
  constructor(
    private readonly imagesRepository: ImagesRepository,
    private readonly videosRepository: VideosRepository
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.createRespectiveEntity.bind(this) as (event: unknown) => void,
      FileUploadedEvent.name
    )
  }

  private async createRespectiveEntity({ file }: FileUploadedEvent) {
    if (/image\/(jpeg|png)/.test(file.fileType)) {
      const image = Image.create({
        body: file.body,
        imageName: file.fileName,
        size: file.size,
        imageKey: file.fileKey,
        imageType: file.fileType as 'image/jpeg' | 'image/png',
        storedAt: file.storedAt
      })

      await this.imagesRepository.create(image)
    } else if (/video\/(mp4|avi)/.test(file.fileType)) {
      const video = Video.create({
        body: file.body,
        videoName: file.fileName,
        size: file.size,
        videoKey: file.fileKey,
        videoType: file.fileType as 'video/mp4' | 'video/avi',
        duration: 24,
        storedAt: file.storedAt
      })

      await this.videosRepository.create(video)
    }
  }
}
