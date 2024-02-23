import { left, right, type Either } from '@/core/either'
import { InvalidMimeTypeError } from '@/core/errors/errors/invalid-mime-type-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { Video } from '../../enterprise/entities/video'
import { type VideosRepository } from './../repositories/videos-repository'

interface UploadVideoUseCaseRequest {
  videoName: string
  videoType: 'video/mp4' | 'video/avi'
  body: Buffer
  duration: number
  size: number
}

type UploadVideoUseCaseResponse = Either<
InvalidMimeTypeError,
{
  video: Video
}
>

export class UploadVideoUseCase implements UseCase<UploadVideoUseCaseRequest, UploadVideoUseCaseResponse> {
  constructor(
    private readonly videosRepository: VideosRepository
  ) {}

  async exec({
    videoName,
    videoType,
    body,
    duration,
    size
  }: UploadVideoUseCaseRequest): Promise<UploadVideoUseCaseResponse> {
    if (!/video\/(mp4|avi)/.test(videoType)) {
      return left(new InvalidMimeTypeError(videoType))
    }

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
