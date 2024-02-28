import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Video } from '../../enterprise/entities/video'
import { type VideosRepository } from '../repositories/videos-repository'

interface GetVideoDetailsByIdUseCaseRequest {
  videoId: string
}

type GetVideoDetailsByIdUseCaseResponse = Either<
ResourceNotFoundError,
{
  video: Video
}
>

export class GetVideoDetailsByIdUseCase implements UseCase<GetVideoDetailsByIdUseCaseRequest, GetVideoDetailsByIdUseCaseResponse> {
  constructor(
    private readonly videosRepository: VideosRepository
  ) { }

  async exec({
    videoId
  }: GetVideoDetailsByIdUseCaseRequest): Promise<GetVideoDetailsByIdUseCaseResponse> {
    const video = await this.videosRepository.findById(videoId)

    if (!video) {
      return left(new ResourceNotFoundError())
    }

    return right({
      video
    })
  }
}
