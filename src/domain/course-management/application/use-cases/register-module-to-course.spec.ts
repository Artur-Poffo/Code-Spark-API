import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCourse } from '../../../../../test/factories/make-course'
import { makeInstructor } from '../../../../../test/factories/make-instructor'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCourseTagsRepository } from '../../../../../test/repositories/in-memory-course-tags-repository'
import { InMemoryEnrollmentsRepository } from '../../../../../test/repositories/in-memory-enrollments-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { InMemoryCoursesRepository } from './../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryInstructorRepository } from './../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from './../../../../../test/repositories/in-memory-modules-repository'
import { ModuleAlreadyExistsInThisCourseError } from './errors/module-already-exists-in-this-course-error'
import { ModuleNumberIsAlreadyInUseError } from './errors/module-number-already-in-use-error'
import { RegisterModuleToCourseUseCase } from './register-module-to-course'

let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryInstructorRepository: InMemoryInstructorRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let sut: RegisterModuleToCourseUseCase

describe('Register module to a course use case', () => {
  beforeEach(() => {
    inMemoryClassesRepository = new InMemoryClassesRepository()
    inMemoryCourseTagsRepository = new InMemoryCourseTagsRepository()
    inMemoryInstructorRepository = new InMemoryInstructorRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)

    inMemoryEnrollmentsRepository = new InMemoryEnrollmentsRepository(
      inMemoryClassesRepository, inMemoryModulesRepository
    )
    inMemoryCoursesRepository = new InMemoryCoursesRepository(inMemoryModulesRepository, inMemoryInstructorRepository, inMemoryEnrollmentsRepository, inMemoryStudentsRepository, inMemoryCourseTagsRepository)

    sut = new RegisterModuleToCourseUseCase(inMemoryCoursesRepository, inMemoryModulesRepository)
  })

  it('an instructor must be able to register module for your course', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const result = await sut.exec({
      name: 'John Doe Module',
      description: 'module registration',
      moduleNumber: 1,
      courseId: course.id.toString(),
      instructorId: instructor.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      module: expect.objectContaining({
        name: 'John Doe Module'
      })
    })
  })

  it('should not be able to register a module for a inexistent course', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorRepository.create(instructor)

    const result = await sut.exec({
      name: 'John Doe Module',
      description: 'module registration',
      moduleNumber: 1,
      courseId: 'inexistentCourseId',
      instructorId: instructor.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to register a module for a course if the instructor not is the sponsor', async () => {
    const correctInstructor = makeInstructor()
    await inMemoryInstructorRepository.create(correctInstructor)

    const wrongInstructor = makeInstructor()
    await inMemoryInstructorRepository.create(wrongInstructor)

    const course = makeCourse({ instructorId: correctInstructor.id })
    await inMemoryCoursesRepository.create(course)

    const result = await sut.exec({
      name: 'John Doe Module',
      description: 'module registration',
      moduleNumber: 1,
      courseId: course.id.toString(),
      instructorId: wrongInstructor.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to register a module for a specific course with same name twice', async () => {
    const name = 'John Doe Module'

    const instructor = makeInstructor()
    await inMemoryInstructorRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    await sut.exec({
      name,
      description: 'module registration',
      moduleNumber: 1,
      courseId: course.id.toString(),
      instructorId: instructor.id.toString()
    })

    const result = await sut.exec({
      name,
      description: 'module registration',
      moduleNumber: 1,
      courseId: course.id.toString(),
      instructorId: instructor.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ModuleAlreadyExistsInThisCourseError)
  })

  it('should not be able to register a module for a specific course in the same position twice', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    await sut.exec({
      name: 'John Doe Module 1',
      description: 'module registration',
      moduleNumber: 1, // Add a module to the first position
      courseId: course.id.toString(),
      instructorId: instructor.id.toString()
    })

    const result = await sut.exec({
      name: 'John Doe Module 2',
      description: 'module registration',
      moduleNumber: 1, // trying to add a new module for the same position, as the first module
      courseId: course.id.toString(),
      instructorId: instructor.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ModuleNumberIsAlreadyInUseError)
  })
})
