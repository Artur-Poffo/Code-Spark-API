import { OnImageUploaded } from '@/domain/storage/application/subscribers/on-image-uploaded'
import { UploadFileUseCase } from '@/domain/storage/application/use-cases/upload-file'
import { makeImage } from '../../../../../test/factories/make-image'
import { InMemoryFilesRepository } from '../../../../../test/repositories/in-memory-files-repository'
import { InMemoryImagesRepository } from '../../../../../test/repositories/in-memory-images-repository'
import { FakeUploader } from '../../../../../test/storage/fake-uploader'
import { waitFor } from '../../../../../test/utils/wait-for'
import { OnImageKeyGenerated } from './on-image-key-generated'

let inMemoryFilesRepository: InMemoryFilesRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let fakeUploader: FakeUploader
let uploadFileUseCase: UploadFileUseCase

describe('On image key generated', () => {
  beforeEach(async () => {
    inMemoryFilesRepository = new InMemoryFilesRepository()
    inMemoryImagesRepository = new InMemoryImagesRepository()
    fakeUploader = new FakeUploader()
    uploadFileUseCase = new UploadFileUseCase(inMemoryFilesRepository, fakeUploader)

    new OnImageUploaded(uploadFileUseCase)

    new OnImageKeyGenerated(
      inMemoryImagesRepository
    )
  })

  it('should be able append generated image key to respective image', async () => {
    const image = makeImage()
    await inMemoryImagesRepository.create(image)

    await waitFor(() => {
      expect(inMemoryImagesRepository.items[0]).toMatchObject({
        imageKey: fakeUploader.files[0].fileKey
      })
    }, 3000)
  })
})
