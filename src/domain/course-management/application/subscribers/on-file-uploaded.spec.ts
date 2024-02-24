import { OnFileUploaded } from '@/domain/course-management/application/subscribers/on-file-uploaded'
import { GetVideoDuration } from '@/infra/storage/utils/get-video-duration'
import { InMemoryVideosRepository } from '../../../../../test/repositories/in-memory-videos-repository'
import { waitFor } from '../../../../../test/utils/wait-for'
import { InMemoryFilesRepository } from './../../../../../test/repositories/in-memory-files-repository'
import { InMemoryImagesRepository } from './../../../../../test/repositories/in-memory-images-repository'
import { FakeUploader } from './../../../../../test/storage/fake-uploader'
import { UploadFileUseCase } from './../../../storage/application/use-cases/upload-file'

let inMemoryFilesRepository: InMemoryFilesRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryVideosRepository: InMemoryVideosRepository
let fakeUploader: FakeUploader
let getVideoDuration: GetVideoDuration
let uploadFileUseCase: UploadFileUseCase

describe('On file uploaded event', () => {
  beforeEach(() => {
    inMemoryFilesRepository = new InMemoryFilesRepository()
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryVideosRepository = new InMemoryVideosRepository()
    fakeUploader = new FakeUploader()
    getVideoDuration = new GetVideoDuration()
    uploadFileUseCase = new UploadFileUseCase(
      inMemoryFilesRepository,
      fakeUploader
    )

    new OnFileUploaded(
      inMemoryImagesRepository,
      inMemoryVideosRepository,
      getVideoDuration
    )
  })

  it('should be able to upload a file and persist your respective entity, image or video', async () => {
    const result = await uploadFileUseCase.exec({
      fileName: 'file.jpg',
      body: Buffer.from('image body'),
      size: 1024,
      fileType: 'image/jpeg'
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryFilesRepository.items[0]).toMatchObject({
      fileName: 'file.jpg'
    })
    expect(fakeUploader.files[0]).toMatchObject({
      fileName: 'file.jpg'
    })
    await waitFor(() => {
      expect(inMemoryImagesRepository.items[0]).toMatchObject({
        imageName: 'file.jpg'
      })
    }, 5000)
  })
})
