import { right, type Either } from '@/core/either'
import { type UseCase } from '@/core/use-cases/use-case'
import { Image } from '../../enterprise/entities/image'
import { type ImagesRepository } from './../repositories/images-repository'

interface UploadImageUseCaseRequest {
  imageName: string
  imageType: 'image/jpeg' | 'image/png'
  body: Buffer
  size: number
}

type UploadImageUseCaseResponse = Either<
null,
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
