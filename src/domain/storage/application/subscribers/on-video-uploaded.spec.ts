import { makeVideo } from '../../../../../test/factories/make-video'
import { InMemoryFilesRepository } from '../../../../../test/repositories/in-memory-files-repository'
import { InMemoryVideosRepository } from '../../../../../test/repositories/in-memory-videos-repository'
import { FakeUploader } from '../../../../../test/storage/fake-uploader'

let inMemoryFilesRepository: InMemoryFilesRepository
let inMemoryVideosRepository: InMemoryVideosRepository
let fakeUploader: FakeUploader

describe('On video uploaded', () => {
  beforeEach(() => {
    inMemoryFilesRepository = new InMemoryFilesRepository()
    inMemoryVideosRepository = new InMemoryVideosRepository()
    fakeUploader = new FakeUploader()
  })

  it('should be able to upload a video', async () => {
    const video = makeVideo()
    await inMemoryVideosRepository.create(video)

    expect(inMemoryFilesRepository.items[0]).toBe({
      name: video.videoName
    })
    expect(fakeUploader.files[0]).toBe({
      name: video.videoName
    })
  })
})
