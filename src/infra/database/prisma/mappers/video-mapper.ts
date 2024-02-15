import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type VideosRepository } from '@/domain/course-management/application/repositories/videos-repository'
import { Video } from '@/domain/course-management/enterprise/entities/video'
import { type Prisma, type Video as PrismaVideo } from '@prisma/client'
import { type FilesRepository } from './../../../../domain/storage/application/repositories/files-repository'

export class VideoMapper {
  constructor(
    private readonly videosRepository: VideosRepository,
    private readonly filesRepository: FilesRepository
  ) {}

  private async getDomainVideo(videoId: string) {
    return await this.videosRepository.findById(videoId)
  }

  private async getRespectiveFile(videoKey: string) {
    return await this.filesRepository.findByKey(videoKey)
  }

  async toDomain(raw: PrismaVideo): Promise<Video | null> {
    const video = await this.getDomainVideo(raw.id)

    if (!video) {
      return null
    }

    return Video.create(
      {
        videoName: video.videoName,
        size: video.size,
        body: video.body,
        videoKey: video.videoKey,
        videoType: video.videoType,
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

    const file = await this.getRespectiveFile(video.videoKey)

    if (!file) {
      return null
    }

    return {
      id: video.id.toString(),
      duration: video.duration,
      fileId: file.id.toString()
    }
  }
}
