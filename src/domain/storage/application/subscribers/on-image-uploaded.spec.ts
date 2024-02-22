import { makeImage } from '../../../../../test/factories/make-image'
import { InMemoryFilesRepository } from '../../../../../test/repositories/in-memory-files-repository'
import { InMemoryImagesRepository } from '../../../../../test/repositories/in-memory-images-repository'
import { FakeUploader } from '../../../../../test/storage/fake-uploader'
import { UploadFileUseCase } from './../use-cases/upload-file'
import { OnImageUploaded } from './on-image-uploaded'

let inMemoryFilesRepository: InMemoryFilesRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let fakeUploader: FakeUploader
let uploadFileUseCase: UploadFileUseCase

describe('On image uploaded', () => {
  beforeEach(() => {
    inMemoryFilesRepository = new InMemoryFilesRepository()
    inMemoryImagesRepository = new InMemoryImagesRepository()
    fakeUploader = new FakeUploader()
    uploadFileUseCase = new UploadFileUseCase(inMemoryFilesRepository, fakeUploader)

    new OnImageUploaded(uploadFileUseCase)
  })

  it('should be able to upload a image', async () => {
    const image = makeImage()
    await inMemoryImagesRepository.create(image)

    expect(inMemoryFilesRepository.items[0]).toMatchObject({
      fileName: image.imageName,
      body: image.body
    })
    expect(fakeUploader.files[0]).toMatchObject({
      fileName: image.imageName,
      body: image.body
    })
  })
})
