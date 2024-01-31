import { InMemoryVideosRepository } from './../../../../../test/repositories/in-memory-videos-repository'
import { UploadVideoUseCase } from './upload-video'

let inMemoryVideosRepository: InMemoryVideosRepository
let sut: UploadVideoUseCase

describe('Add video to class use case', () => {
  beforeEach(() => {
    inMemoryVideosRepository = new InMemoryVideosRepository()
    sut = new UploadVideoUseCase(inMemoryVideosRepository)
  })

  it('should be able to upload a video', async () => {
    const result = await sut.exec({
      videoName: 'videoName',
      videoType: 'video/mp4',
      body: Buffer.from('videoBody'),
      duration: 60 * 10, // Ten minutes,
      size: 1024 * 1024 // 1MB
    })

    expect(result.isRight()).toBe(true)
  })
})
