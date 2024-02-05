import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCourse } from '../../../../../test/factories/make-course'
import { makeInstructor } from '../../../../../test/factories/make-instructor'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryInstructorRepository } from '../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from '../../../../../test/repositories/in-memory-modules-repository'
import { GetInstructorWithCoursesUseCase } from './get-instructor-with-courses'

let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: GetInstructorWithCoursesUseCase

describe('Get instructors with their courses', () => {
  beforeEach(() => {
    inMemoryClassesRepository = new InMemoryClassesRepository()
    inMemoryInstructorsRepository = new InMemoryInstructorRepository()

    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)
    inMemoryCoursesRepository = new InMemoryCoursesRepository(inMemoryModulesRepository, inMemoryInstructorsRepository)

    sut = new GetInstructorWithCoursesUseCase(inMemoryCoursesRepository)
  })

  it('should be able to get instructor info with their courses', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const firstCourse = makeCourse({ name: 'First Course', instructorId: instructor.id })
    const secondCourse = makeCourse({ name: 'Second Course', instructorId: instructor.id })

    await Promise.all([
      inMemoryCoursesRepository.create(firstCourse),
      inMemoryCoursesRepository.create(secondCourse)
    ])

    const result = await sut.exec({
      instructorId: instructor.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      instructor: expect.objectContaining({
        courses: expect.arrayContaining([
          expect.objectContaining({
            name: 'First Course'
          })
        ])
      })
    })
  })

  it('should not be able to get a inexistent instructor info with their courses', async () => {
    const result = await sut.exec({
      instructorId: 'inexistentInstructorId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
