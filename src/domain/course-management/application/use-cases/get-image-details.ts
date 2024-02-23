import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Image } from '../../enterprise/entities/image'
import { type ImagesRepository } from '../repositories/images-repository'

interface GetImageDetailsUseCaseRequest {
  imageId: string
}

type GetImageDetailsUseCaseResponse = Either<
ResourceNotFoundError,
{
  image: Image
}
>

export class GetImageDetailsUseCase implements UseCase<GetImageDetailsUseCaseRequest, GetImageDetailsUseCaseResponse> {
  constructor(
    private readonly imagesRepository: ImagesRepository
  ) { }

  async exec({
    imageId
  }: GetImageDetailsUseCaseRequest): Promise<GetImageDetailsUseCaseResponse> {
    const image = await this.imagesRepository.findById(imageId)

    if (!image) {
      return left(new ResourceNotFoundError())
    }

    return right({
      image
    })
  }
}
