import { InMemoryFilesRepository } from '../../../../../test/repositories/in-memory-files-repository'
import { FakeUploader } from '../../../../../test/storage/fake-uploader'
import { InvalidMimeTypeError } from './errors/invalid-mime-type-error'
import { UploadFileUseCase } from './upload-file'

let inMemoryFilesRepository: InMemoryFilesRepository
let fakeUploader: FakeUploader
let sut: UploadFileUseCase

describe('Upload file use case', () => {
  beforeEach(() => {
    inMemoryFilesRepository = new InMemoryFilesRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadFileUseCase(inMemoryFilesRepository, fakeUploader)
  })

  it('should be able to upload a new file', async () => {
    const result = await sut.exec({
      fileName: 'profile',
      fileType: 'image/jpeg',
      size: 1024 * 1024, // One megabyte
      body: Buffer.from('body-image')
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryFilesRepository.items[0]).toMatchObject({
      fileName: 'profile'
    })
    expect(fakeUploader.files[0]).toMatchObject({
      fileName: 'profile'
    })
  })

  it('should not be able to upload a new file with a invalid mime type', async () => {
    const result = await sut.exec({
      fileName: 'profile',
      fileType: 'image/svg', // Invalid Mime Type
      size: 1024 * 1024, // One megabyte
      body: Buffer.from('body-image')
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidMimeTypeError)
  })
})
