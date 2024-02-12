import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeStudent } from '../../../../../test/factories/make-student'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { InMemoryInstructorRepository } from './../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryUsersRepository } from './../../../../../test/repositories/in-memory-users-repository'
import { DeleteUserUseCase } from './delete-user'

let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: DeleteUserUseCase

describe('Delete user use case', () => {
  beforeEach(() => {
    inMemoryInstructorsRepository = new InMemoryInstructorRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryUsersRepository = new InMemoryUsersRepository(inMemoryInstructorsRepository, inMemoryStudentsRepository)

    sut = new DeleteUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to delete a user', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com'
    })
    await inMemoryUsersRepository.create(student)

    const result = await sut.exec({
      userId: student.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      user: {
        email: 'johndoe@example.com'
      }
    })
    expect(inMemoryUsersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a inexistent user', async () => {
    const result = await sut.exec({
      userId: 'inexistentUserId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
