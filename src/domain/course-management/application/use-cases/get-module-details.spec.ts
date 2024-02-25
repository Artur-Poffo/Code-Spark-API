import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeModule } from '../../../../../test/factories/make-module'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryModulesRepository } from '../../../../../test/repositories/in-memory-modules-repository'
import { GetModuleDetailsUseCase } from './get-module-details'

let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let sut: GetModuleDetailsUseCase

describe('Get module details use case', () => {
  beforeEach(() => {
    inMemoryClassesRepository = new InMemoryClassesRepository()
    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)

    sut = new GetModuleDetailsUseCase(inMemoryModulesRepository)
  })

  it('should be able to get module details', async () => {
    const module = makeModule({ name: 'John Doe Module' })
    await inMemoryModulesRepository.create(module)

    const result = await sut.exec({
      moduleId: module.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      module: expect.objectContaining({
        name: 'John Doe Module'
      })
    })
  })

  it('should not be able to get module details of a inexistent module', async () => {
    const result = await sut.exec({
      moduleId: 'inexistentModuleId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
