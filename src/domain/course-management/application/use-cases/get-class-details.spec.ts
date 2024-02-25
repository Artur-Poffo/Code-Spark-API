import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeClass } from '../../../../../test/factories/make-class'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { GetClassDetailsUseCase } from './get-class-details'

let inMemoryClassesRepository: InMemoryClassesRepository
let sut: GetClassDetailsUseCase

describe('Get module details use case', () => {
  beforeEach(() => {
    inMemoryClassesRepository = new InMemoryClassesRepository()
    sut = new GetClassDetailsUseCase(inMemoryClassesRepository)
  })

  it('should be able to get class details', async () => {
    const classToFind = makeClass({ name: 'John Doe Class' })
    await inMemoryClassesRepository.create(classToFind)

    const result = await sut.exec({
      classId: classToFind.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      class: expect.objectContaining({
        name: 'John Doe Class'
      })
    })
  })

  it('should not be able to get class details of a inexistent class', async () => {
    const result = await sut.exec({
      classId: 'inexistentClassId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
