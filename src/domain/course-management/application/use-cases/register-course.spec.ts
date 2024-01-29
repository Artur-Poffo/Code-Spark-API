import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeInstructor } from '../../../../../test/factories/make-instructor'
import { makeStudent } from '../../../../../test/factories/make-student'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCoursesRepository } from './../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryInstructorRepository } from './../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from './../../../../../test/repositories/in-memory-modules-repository'
import { InMemoryStudentsRepository } from './../../../../../test/repositories/in-memory-students-repository'
import { CourseAlreadyExistsInThisAccountError } from './errors/course-already-exists-in-this-account-error'
import { RegisterCourseUseCase } from './register-course'

let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let inMemoryInstructorRepository: InMemoryInstructorRepository
let sut: RegisterCourseUseCase

describe('Register course use case', () => {
  beforeEach(() => {
    inMemoryModulesRepository = new InMemoryModulesRepository()
    inMemoryClassesRepository = new InMemoryClassesRepository(inMemoryModulesRepository)
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryCoursesRepository = new InMemoryCoursesRepository(inMemoryModulesRepository, inMemoryClassesRepository, inMemoryInstructorRepository)
    inMemoryInstructorRepository = new InMemoryInstructorRepository(inMemoryCoursesRepository)
    sut = new RegisterCourseUseCase(inMemoryCoursesRepository, inMemoryInstructorRepository)
  })

  it('an instructor must be able to register a new course', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorRepository.create(instructor)

    const result = await sut.exec({
      name: 'New course',
      description: 'Course description',
      instructorId: instructor.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      course: expect.objectContaining({
        name: 'New course'
      })
    })
  })

  it('a student should not be able to register a new course', async () => {
    const student = makeStudent()
    await inMemoryStudentsRepository.create(student)

    const result = await sut.exec({
      name: 'New course',
      description: 'Course description',
      instructorId: student.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to register a new course for a inexistent instructor', async () => {
    const result = await sut.exec({
      name: 'New course',
      description: 'Course description',
      instructorId: 'inexistentInstructor'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to register two courses with the same name in the same instructor account', async () => {
    const name = 'John Doe Course'

    const instructor = makeInstructor()
    await inMemoryInstructorRepository.create(instructor)

    await sut.exec({
      name,
      description: 'Course description',
      instructorId: instructor.id.toString()
    })

    const result = await sut.exec({
      name,
      description: 'Course description',
      instructorId: instructor.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CourseAlreadyExistsInThisAccountError)
  })
})
