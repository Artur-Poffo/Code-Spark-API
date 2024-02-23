import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCourse } from '../../../../../test/factories/make-course'
import { makeInstructor } from '../../../../../test/factories/make-instructor'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCourseTagsRepository } from '../../../../../test/repositories/in-memory-course-tags-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryEnrollmentCompletedItemsRepository } from '../../../../../test/repositories/in-memory-enrollment-completed-items-repository'
import { InMemoryEnrollmentsRepository } from '../../../../../test/repositories/in-memory-enrollments-repository'
import { InMemoryInstructorRepository } from '../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from '../../../../../test/repositories/in-memory-modules-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { GetCourseInstructorDetailsUseCase } from './get-course-instructor-details'

let inMemoryEnrollmentCompletedItemsRepository: InMemoryEnrollmentCompletedItemsRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: GetCourseInstructorDetailsUseCase

describe('Get course instructor details use case', () => {
  beforeEach(() => {
    inMemoryEnrollmentCompletedItemsRepository = new InMemoryEnrollmentCompletedItemsRepository()
    inMemoryClassesRepository = new InMemoryClassesRepository()
    inMemoryCourseTagsRepository = new InMemoryCourseTagsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryInstructorsRepository = new InMemoryInstructorRepository()

    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)

    inMemoryEnrollmentsRepository = new InMemoryEnrollmentsRepository(
      inMemoryStudentsRepository, inMemoryEnrollmentCompletedItemsRepository
    )
    inMemoryCoursesRepository = new InMemoryCoursesRepository(inMemoryModulesRepository, inMemoryInstructorsRepository, inMemoryEnrollmentsRepository, inMemoryStudentsRepository, inMemoryCourseTagsRepository)

    sut = new GetCourseInstructorDetailsUseCase(inMemoryCoursesRepository, inMemoryInstructorsRepository)
  })

  it('should be able to get course instructor details', async () => {
    const instructor = makeInstructor({ name: 'John Doe' })
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ name: 'John Doe Course', instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const result = await sut.exec({
      courseId: course.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      instructor: expect.objectContaining({
        name: 'John Doe'
      })
    })
  })

  it('should not be able to get course details of a inexistent course', async () => {
    const result = await sut.exec({
      courseId: 'inexistentCourseId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
