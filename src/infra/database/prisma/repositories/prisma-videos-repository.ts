import { type VideosRepository } from '@/domain/course-management/application/repositories/videos-repository'
import { type Video } from '@/domain/course-management/enterprise/entities/video'
import { prisma } from '..'
import { type VideoMapper } from '../mappers/video-mapper'

export class PrismaVideosRepository implements VideosRepository {
  constructor(
    private readonly videoMapper: VideoMapper
  ) {}

  async findById(id: string): Promise<Video | null> {
    const video = await prisma.video.findUnique({
      where: {
        id
      }
    })

    if (!video) {
      return null
    }

    const domainVideo = await this.videoMapper.toDomain(video)

    return domainVideo
  }

  async appendVideoKey(videoKey: string, videoId: string): Promise<Video | null> {
    const video = await prisma.video.findUnique({
      where: {
        id: videoId
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

    const domainVideo = await this.videoMapper.toDomain(video)

    return domainVideo
  }

  async create(video: Video): Promise<Video | null> {
    const infraVideo = await this.videoMapper.toPrisma(video)

    if (!infraVideo) {
      return null
    }

    await prisma.video.create({
      data: infraVideo
    })

    return video
  }
}