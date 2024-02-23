import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeImage } from '../../../../../test/factories/make-image'
import { InMemoryImagesRepository } from './../../../../../test/repositories/in-memory-images-repository'
import { GetImageDetailsUseCase } from './get-image-details'

let inMemoryImagesRepository: InMemoryImagesRepository
let sut: GetImageDetailsUseCase

describe('Get image details use case', async () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    sut = new GetImageDetailsUseCase(inMemoryImagesRepository)
  })

  it('should be able to get image details', async () => {
    const name = 'john-doe-image.jpeg'

    const image = makeImage({ imageName: name })

    await inMemoryImagesRepository.create(image)

    const result = await sut.exec({
      imageId: image.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      image: expect.objectContaining({
        imageName: name
      })
    })
  })

  it('should not be able to get image details of a inexistent image', async () => {
    const result = await sut.exec({
      imageId: 'inexistentImageId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
