import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Video } from '@/domain/course-management/enterprise/entities/video'
import { type Prisma } from '@prisma/client'

export class VideoMapper {
  static toDomain(raw: Prisma.VideoGetPayload<{ include: { file: true } }>) {
    if (!raw.file) {
      return null
    }

    if (raw.file.type !== 'video/mp4' && raw.file.type !== 'video/avi') {
      return null
    }

    return Video.create(
      {
        videoName: raw.file.name,
        size: Number(raw.file.size),
        body: raw.file.body,
        videoKey: raw.fileKey,
        videoType: raw.file.type,
        duration: Number(raw.duration),
        storedAt: raw.file.storedAt
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(video: Video) {
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
