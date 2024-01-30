import { InMemoryTagsRepository } from './../../../../../test/repositories/in-memory-tags-repository'
import { RepeatedTagError } from './errors/repeated-tag-error'
import { TagAlreadyExistsError } from './errors/tag-already-exists-error'
import { RegisterTagUseCase } from './register-tag'

let inMemoryTagsRepository: InMemoryTagsRepository
let sut: RegisterTagUseCase

describe('Register tag use case', () => {
  beforeEach(() => {
    inMemoryTagsRepository = new InMemoryTagsRepository()
    sut = new RegisterTagUseCase(inMemoryTagsRepository)
  })

  it('should be able to register a new tag for the application', async () => {
    const result = await sut.exec({
      tags: 'TypeScript'
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTagsRepository.items[0].value).toBe('TYPESCRIPT')
  })

  it('should be able to register many tags for the application at the same time', async () => {
    const result = await sut.exec({
      tags: ['TypeScript', 'Next.js', 'Vue.js']
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      tags: expect.arrayContaining([
        expect.objectContaining({
          value: 'TYPESCRIPT'
        }),
        expect.objectContaining({
          value: 'VUE.JS'
        })
      ])
    })
  })

  it('should not be able to register a new tag for the application with same value twice', async () => {
    await sut.exec({
      tags: 'TypeScript'
    })

    const result = await sut.exec({
      tags: 'TypeScript'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(TagAlreadyExistsError)
  })

  it('should not be able to register a new tag for the application with same value twice in same exec', async () => {
    const result = await sut.exec({
      tags: ['TypeScript', 'TypeScript']
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(RepeatedTagError)
  })
})
