import { right, type Either } from '@/core/either'
import { type ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { Image } from '../../enterprise/entities/image'
import { type ImagesRepository } from './../repositories/images-repository'

interface UploadImageUseCaseRequest {
  imageName: string
  imageType?: 'image/jpeg' | 'image/png'
  body: Buffer
  duration: number
  size: number
}

type UploadImageUseCaseResponse = Either<
ResourceNotFoundError,
{
  image: Image
}
>

export class UploadImageUseCase implements UseCase<UploadImageUseCaseRequest, UploadImageUseCaseResponse> {
  constructor(
    private readonly imagesRepository: ImagesRepository
  ) {}

  async exec({
    imageName,
    imageType,
    body,
    duration,
    size
  }: UploadImageUseCaseRequest): Promise<UploadImageUseCaseResponse> {
    const image = Image.create({
      imageName,
      imageType,
      body,
      size
    })

    await this.imagesRepository.create(image)

    return right({
      image
    })
  }
}
