import { OnVideoUploaded } from '@/domain/storage/application/subscribers/on-video-uploaded'
import { UploadFileUseCase } from '@/domain/storage/application/use-cases/upload-file'
import { makeVideo } from '../../../../../test/factories/make-video'
import { InMemoryFilesRepository } from '../../../../../test/repositories/in-memory-files-repository'
import { InMemoryVideosRepository } from '../../../../../test/repositories/in-memory-videos-repository'
import { FakeUploader } from '../../../../../test/storage/fake-uploader'
import { waitFor } from '../../../../../test/utils/wait-for'
import { OnVideoKeyGenerated } from './on-video-key-generated'

let inMemoryFilesRepository: InMemoryFilesRepository
let inMemoryVideosRepository: InMemoryVideosRepository
let fakeUploader: FakeUploader
let uploadFileUseCase: UploadFileUseCase

describe('On video key generated', () => {
  beforeEach(() => {
    inMemoryFilesRepository = new InMemoryFilesRepository()
    inMemoryVideosRepository = new InMemoryVideosRepository()
    fakeUploader = new FakeUploader()
    uploadFileUseCase = new UploadFileUseCase(inMemoryFilesRepository, fakeUploader)

    new OnVideoUploaded(uploadFileUseCase)

    new OnVideoKeyGenerated(
      inMemoryVideosRepository
    )
  })

  it('should be able append generated video key to respective video', async () => {
    const video = makeVideo()
    await inMemoryVideosRepository.create(video)

    await waitFor(() => {
      expect(inMemoryVideosRepository.items[0]).toMatchObject({
        videoKey: fakeUploader.files[0].fileKey
      })
    }, 3000)
  })
})
