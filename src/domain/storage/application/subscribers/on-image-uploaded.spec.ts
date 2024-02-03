import { makeImage } from '../../../../../test/factories/make-image'
import { InMemoryFilesRepository } from '../../../../../test/repositories/in-memory-files-repository'
import { InMemoryImagesRepository } from '../../../../../test/repositories/in-memory-images-repository'
import { FakeUploader } from '../../../../../test/storage/fake-uploader'
import { waitFor } from '../../../../../test/utils/wait-for'
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

    new OnImageUploaded(uploadFileUseCase, inMemoryImagesRepository)
  })

  it('should be able to upload a image', async () => {
    const image = makeImage()
    await inMemoryImagesRepository.create(image)

    expect(inMemoryFilesRepository.items[0]).toMatchObject({
      fileName: image.imageName
    })
    expect(fakeUploader.files[0]).toMatchObject({
      fileName: image.imageName
    })
  })

  it('should append generated fileKey to pattern file on courses domain', async () => {
    const image = makeImage()
    await inMemoryImagesRepository.create(image)

    await waitFor(() => {
      expect(inMemoryImagesRepository.items[0]).toMatchObject({
        imageKey: fakeUploader.files[0].fileKey
      })
    })
  })
})
