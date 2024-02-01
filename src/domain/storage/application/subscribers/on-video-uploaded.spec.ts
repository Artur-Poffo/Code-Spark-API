import { makeVideo } from '../../../../../test/factories/make-video'
import { InMemoryFilesRepository } from '../../../../../test/repositories/in-memory-files-repository'
import { InMemoryVideosRepository } from '../../../../../test/repositories/in-memory-videos-repository'
import { FakeUploader } from '../../../../../test/storage/fake-uploader'
import { UploadFileUseCase } from './../use-cases/upload-file'
import { OnVideoUploaded } from './on-video-uploaded'

let inMemoryFilesRepository: InMemoryFilesRepository
let inMemoryVideosRepository: InMemoryVideosRepository
let fakeUploader: FakeUploader
let uploadFileUseCase: UploadFileUseCase

describe('On video uploaded', () => {
  beforeEach(() => {
    inMemoryFilesRepository = new InMemoryFilesRepository()
    inMemoryVideosRepository = new InMemoryVideosRepository()
    fakeUploader = new FakeUploader()
    uploadFileUseCase = new UploadFileUseCase(inMemoryFilesRepository, fakeUploader)

    new OnVideoUploaded(uploadFileUseCase)
  })

  it('should be able to upload a video', async () => {
    const video = makeVideo()
    await inMemoryVideosRepository.create(video)

    expect(inMemoryFilesRepository.items[0]).toMatchObject({
      fileName: video.videoName
    })
    expect(fakeUploader.files[0]).toMatchObject({
      fileName: video.videoName
    })
  })
})
