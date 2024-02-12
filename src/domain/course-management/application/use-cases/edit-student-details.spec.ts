import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeStudent } from '../../../../../test/factories/make-student'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { EditStudentDetailsUseCase } from './edit-student-details'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: EditStudentDetailsUseCase

describe('Edit student details use case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    sut = new EditStudentDetailsUseCase(inMemoryStudentsRepository)
  })

  it('should be able to edit student details', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
      name: 'John Doe'
    })
    await inMemoryStudentsRepository.create(student)

    const result = await sut.exec({
      email: 'newEmail@gmail.com',
      studentId: student.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      student: expect.objectContaining({
        email: 'newEmail@gmail.com',
        name: 'John Doe'
      })
    })
  })

  it('should not be able to edit a inexistent student', async () => {
    const result = await sut.exec({
      email: 'newEmail@gmail.com',
      studentId: 'inexistentStudentId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
