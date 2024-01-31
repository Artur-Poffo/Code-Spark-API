import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeStudent } from '../../../../../test/factories/make-student'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryInstructorRepository } from '../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { InMemoryUsersRepository } from '../../../../../test/repositories/in-memory-users-repository'
import { InMemoryModulesRepository } from './../../../../../test/repositories/in-memory-modules-repository'
import { GetUserInfoUseCase } from './get-user-info'

let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetUserInfoUseCase

describe('Get user info use case', async () => {
  beforeEach(() => {
    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)
    inMemoryClassesRepository = new InMemoryClassesRepository(inMemoryModulesRepository)
    inMemoryCoursesRepository = new InMemoryCoursesRepository(inMemoryModulesRepository, inMemoryClassesRepository, inMemoryInstructorsRepository)
    inMemoryInstructorsRepository = new InMemoryInstructorRepository(inMemoryCoursesRepository)
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository(inMemoryInstructorsRepository, inMemoryStudentsRepository)
    sut = new GetUserInfoUseCase(inMemoryUsersRepository)
  })

  it('should be able to get user info', async () => {
    const student = makeStudent({ name: 'John Doe' })

    await inMemoryUsersRepository.create(student)

    const result = await sut.exec({
      id: student.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      user: expect.objectContaining({
        name: student.name
      })
    })
  })

  it('should not be able to get user info of a inexistent user', async () => {
    const result = await sut.exec({
      id: 'inexistentUserId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
