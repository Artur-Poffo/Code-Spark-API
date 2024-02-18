import { DomainEvents } from '@/core/events/domain-events'
import { type VideosRepository } from '@/domain/course-management/application/repositories/videos-repository'
import { type Video } from '@/domain/course-management/enterprise/entities/video'
import { prisma } from '..'
import { VideoMapper } from './../mappers/video-mapper'

export class PrismaVideosRepository implements VideosRepository {
  async findById(id: string): Promise<Video | null> {
    const video = await prisma.video.findUnique({
      where: {
        id
      },
      include: {
        file: true
      }
    })

    if (!video) {
      return null
    }

    const domainVideo = VideoMapper.toDomain(video)

    return domainVideo
  }

  async findByVideoKey(key: string): Promise<Video | null> {
    const video = await prisma.video.findUnique({
      where: {
        fileKey: key
      },
      include: {
        file: true
      }
    })

    if (!video) {
      return null
    }

    const domainVideo = VideoMapper.toDomain(video)

    return domainVideo
  }

  async appendVideoKey(videoKey: string, videoId: string): Promise<Video | null> {
    const video = await prisma.video.findUnique({
      where: {
        id: videoId
      },
      include: {
        file: true
      }
    })

    if (!video) {
      return null
    }

    await prisma.video.update({
      where: { id: videoId },
      data: {
        file: {
          update: {
            key: videoKey
          }
        }
      }
    })

    const domainVideo = VideoMapper.toDomain(video)

    return domainVideo
  }

  async create(video: Video): Promise<Video | null> {
    const infraVideo = VideoMapper.toPrisma(video)

    if (!infraVideo) {
      return null
    }

    await prisma.video.create({
      data: infraVideo
    })

    DomainEvents.dispatchEventsForAggregate(video.id)

    return video
  }
}
