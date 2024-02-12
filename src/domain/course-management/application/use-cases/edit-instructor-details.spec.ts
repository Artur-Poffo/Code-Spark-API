import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeInstructor } from '../../../../../test/factories/make-instructor'
import { InMemoryInstructorRepository } from '../../../../../test/repositories/in-memory-instructors-repository'
import { EditInstructorDetailsUseCase } from './edit-instructor-details'

let inMemoryInstructorsRepository: InMemoryInstructorRepository
let sut: EditInstructorDetailsUseCase

describe('Edit instructor details use case', () => {
  beforeEach(() => {
    inMemoryInstructorsRepository = new InMemoryInstructorRepository()
    sut = new EditInstructorDetailsUseCase(inMemoryInstructorsRepository)
  })

  it('should be able to edit instructor details', async () => {
    const instructor = makeInstructor({
      email: 'johndoe@example.com',
      name: 'John Doe'
    })
    await inMemoryInstructorsRepository.create(instructor)

    const result = await sut.exec({
      email: 'newEmail@gmail.com',
      instructorId: instructor.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      instructor: expect.objectContaining({
        email: 'newEmail@gmail.com',
        name: 'John Doe'
      })
    })
  })

  it('should not be able to edit a inexistent instructor', async () => {
    const result = await sut.exec({
      email: 'newEmail@gmail.com',
      instructorId: 'inexistentInstructorId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
