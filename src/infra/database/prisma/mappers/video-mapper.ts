import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Video } from '@/domain/course-management/enterprise/entities/video'
import { type FilesRepository } from '@/domain/storage/application/repositories/files-repository'
import { type Prisma, type Video as PrismaVideo } from '@prisma/client'

export class VideoMapper {
  constructor(
    private readonly filesRepository: FilesRepository
  ) {}

  async toDomain(raw: PrismaVideo): Promise<Video | null> {
    const video = await this.filesRepository.findByKey(raw.fileKey)

    if (!video) {
      return null
    }

    return Video.create(
      {
        videoName: video.fileName,
        size: video.size,
        body: video.body,
        videoKey: video.fileKey,
        videoType: video.fileType as 'video/mp4' | 'video/avi',
        duration: Number(raw.duration),
        storedAt: video.storedAt
      },
      new UniqueEntityID(raw.id)
    )
  }

  async toPrisma(video: Video): Promise<Prisma.VideoUncheckedCreateInput | null> {
    if (!video.videoKey) {
      return null
    }

    return {
      id: video.id.toString(),
      duration: video.duration,
      fileKey: video.videoKey
    }
  }
}
