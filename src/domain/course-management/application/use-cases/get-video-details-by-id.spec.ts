import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeVideo } from '../../../../../test/factories/make-video'
import { InMemoryVideosRepository } from './../../../../../test/repositories/in-memory-videos-repository'
import { GetVideoDetailsByIdUseCase } from './get-video-details-by-id'

let inMemoryVideosRepository: InMemoryVideosRepository
let sut: GetVideoDetailsByIdUseCase

describe('Get video details use case', async () => {
  beforeEach(() => {
    inMemoryVideosRepository = new InMemoryVideosRepository()
    sut = new GetVideoDetailsByIdUseCase(inMemoryVideosRepository)
  })

  it('should be able to get video details', async () => {
    const name = 'john-doe-video.mp4'

    const video = makeVideo({ videoName: name, videoKey: '2332323-video.mp4' })

    await inMemoryVideosRepository.create(video)

    const result = await sut.exec({
      videoId: video.id.toString()
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
      videoId: 'inexistentVideoId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
