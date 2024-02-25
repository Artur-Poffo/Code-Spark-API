import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeVideo } from '../../../../../test/factories/make-video'
import { InMemoryVideosRepository } from './../../../../../test/repositories/in-memory-videos-repository'
import { GetVideoDetailsUseCase } from './get-video-details'

let inMemoryVideosRepository: InMemoryVideosRepository
let sut: GetVideoDetailsUseCase

describe('Get video details use case', async () => {
  beforeEach(() => {
    inMemoryVideosRepository = new InMemoryVideosRepository()
    sut = new GetVideoDetailsUseCase(inMemoryVideosRepository)
  })

  it('should be able to get video details', async () => {
    const name = 'john-doe-video.mp4'

    const video = makeVideo({ videoName: name, videoKey: '2332323-video.mp4' })

    await inMemoryVideosRepository.create(video)

    const result = await sut.exec({
      fileKey: video.videoKey
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      video: expect.objectContaining({
        videoName: name
      })
    })
  })

  it('should not be able to get video details of a inexistent video', async () => {
    const result = await sut.exec({
      fileKey: 'inexistentVideoId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
