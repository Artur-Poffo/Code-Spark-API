import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCourse } from '../../../../../test/factories/make-course'
import { makeInstructor } from '../../../../../test/factories/make-instructor'
import { makeModule } from '../../../../../test/factories/make-module'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryInstructorRepository } from '../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from '../../../../../test/repositories/in-memory-modules-repository'
import { GetCourseWithModulesAndClassesUseCase } from './get-course-with-modules-and-classes'

let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let sut: GetCourseWithModulesAndClassesUseCase

describe('Get course details with modules and classes use case', () => {
  beforeEach(() => {
    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)
    inMemoryClassesRepository = new InMemoryClassesRepository(inMemoryModulesRepository)
    inMemoryCoursesRepository = new InMemoryCoursesRepository(inMemoryModulesRepository, inMemoryInstructorsRepository)
    inMemoryInstructorsRepository = new InMemoryInstructorRepository(inMemoryCoursesRepository)

    sut = new GetCourseWithModulesAndClassesUseCase(inMemoryCoursesRepository)
  })

  it('should be able to get course details with modules and classes', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ name: 'John Doe Course', instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const firstModule = makeModule({ name: 'First Module', courseId: course.id })
    const secondModule = makeModule({ name: 'Second Module', courseId: course.id })

    await Promise.all([
      inMemoryModulesRepository.create(firstModule),
      inMemoryModulesRepository.create(secondModule)
    ])

    const result = await sut.exec({
      courseId: course.id.toString()
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to get course details with modules and classes of a inexistent course', async () => {
    const result = await sut.exec({
      courseId: 'inexistentCourseId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
