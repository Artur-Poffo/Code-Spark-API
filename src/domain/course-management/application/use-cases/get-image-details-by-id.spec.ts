import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeImage } from '../../../../../test/factories/make-image'
import { InMemoryImagesRepository } from './../../../../../test/repositories/in-memory-images-repository'
import { GetImageDetailsByIdByIdUseCase } from './get-image-details-by-id'

let inMemoryImagesRepository: InMemoryImagesRepository
let sut: GetImageDetailsByIdByIdUseCase

describe('Get image details use case', async () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    sut = new GetImageDetailsByIdByIdUseCase(inMemoryImagesRepository)
  })

  it('should be able to get image details', async () => {
    const name = 'john-doe-image.jpeg'

    const image = makeImage({ imageName: name, imageKey: '23323232-image.jpeg' })

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
