import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeClass } from '../../../../../test/factories/make-class'
import { InMemoryClassVideosRepository } from '../../../../../test/repositories/in-memory-class-videos-repository'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryModulesRepository } from './../../../../../test/repositories/in-memory-modules-repository'
import { AddVideoToClassUseCase } from './add-video-to-class'

let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryClassVideosRepository: InMemoryClassVideosRepository
let sut: AddVideoToClassUseCase

describe('Add video to class use case', () => {
  beforeEach(() => {
    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)
    inMemoryClassesRepository = new InMemoryClassesRepository(inMemoryModulesRepository)
    inMemoryClassVideosRepository = new InMemoryClassVideosRepository()
    sut = new AddVideoToClassUseCase(inMemoryClassesRepository, inMemoryClassVideosRepository)
  })

  it('should be able to add a new video to a class', async () => {
    const classToTest = makeClass()
    await inMemoryClassesRepository.create(classToTest)

    const result = await sut.exec({
      videoName: 'class-video',
      videoType: 'video/mp4',
      body: Buffer.from('video-buffer'),
      duration: 60 * 10, // Ten minutes,
      classId: classToTest.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      classVideo: expect.objectContaining({
        videoName: 'class-video'
      })
    })
    expect(inMemoryClassVideosRepository.items.length).toBe(1)
  })

  it('should not be able to add a new video to a inexistent class', async () => {
    const result = await sut.exec({
      videoName: 'class-video',
      videoType: 'video/mp4',
      body: Buffer.from('video-buffer'),
      duration: 60 * 10, // Ten minutes,
      classId: 'inexistentClassId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
