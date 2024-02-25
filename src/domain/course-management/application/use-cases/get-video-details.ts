import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Video } from '../../enterprise/entities/video'
import { type VideosRepository } from '../repositories/videos-repository'

interface GetVideoDetailsUseCaseRequest {
  fileKey: string
}

type GetVideoDetailsUseCaseResponse = Either<
ResourceNotFoundError,
{
  video: Video
}
>

export class GetVideoDetailsUseCase implements UseCase<GetVideoDetailsUseCaseRequest, GetVideoDetailsUseCaseResponse> {
  constructor(
    private readonly videosRepository: VideosRepository
  ) { }

  async exec({
    fileKey
  }: GetVideoDetailsUseCaseRequest): Promise<GetVideoDetailsUseCaseResponse> {
    const video = await this.videosRepository.findByVideoKey(fileKey)

    if (!video) {
      return left(new ResourceNotFoundError())
    }

    return right({
      video
    })
  }
}
