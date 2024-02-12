import { InMemoryImagesRepository } from './../../../../../test/repositories/in-memory-images-repository'
import { UploadImageUseCase } from './upload-image'

let inMemoryImagesRepository: InMemoryImagesRepository
let sut: UploadImageUseCase

describe('Upload image use case', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    sut = new UploadImageUseCase(inMemoryImagesRepository)
  })

  it('should be able to upload a image', async () => {
    const result = await sut.exec({
      imageName: 'imageName',
      imageType: 'image/jpeg',
      body: Buffer.from('imageBody'),
      size: 1024 * 1024 // 1MB
    })

    expect(result.isRight()).toBe(true)
  })
})
