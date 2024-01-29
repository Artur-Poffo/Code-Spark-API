import { InMemoryTagsRepository } from './../../../../../test/repositories/in-memory-tags-repository'
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
      value: 'TypeScript'
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTagsRepository.items[0].value).toBe('TypeScript')
  })

  it('should not be able to register a new tag for the application with same value twice', async () => {
    await sut.exec({
      value: 'TypeScript'
    })

    const result = await sut.exec({
      value: 'TypeScript'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(TagAlreadyExistsError)
  })
})
