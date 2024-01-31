import { right, type Either } from '@/core/either'
import { type ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { Video } from '../../enterprise/entities/video'
import { type VideosRepository } from './../repositories/videos-repository'

interface UploadVideoRequest {
  videoName: string
  videoType?: 'video/mp4' | 'video/avi'
  body: Buffer
  duration: number
  size: number
}

type UploadVideoResponse = Either<
ResourceNotFoundError,
{
  video: Video
}
>

export class UploadVideo implements UseCase<UploadVideoRequest, UploadVideoResponse> {
  constructor(
    private readonly videosRepository: VideosRepository
  ) {}

  async exec({
    videoName,
    videoType,
    body,
    duration,
    size
  }: UploadVideoRequest): Promise<UploadVideoResponse> {
    const video = Video.create({
      videoName,
      videoType,
      body,
      duration,
      size
    })

    await this.videosRepository.create(video)

    return right({
      video
    })
  }
}
