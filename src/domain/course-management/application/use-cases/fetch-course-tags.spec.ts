import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCourse } from '../../../../../test/factories/make-course'
import { makeCourseTag } from '../../../../../test/factories/make-course-tag'
import { makeInstructor } from '../../../../../test/factories/make-instructor'
import { makeTag } from '../../../../../test/factories/make-tag'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCourseTagsRepository } from '../../../../../test/repositories/in-memory-course-tags-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryEnrollmentCompletedItemsRepository } from '../../../../../test/repositories/in-memory-enrollment-completed-items-repository'
import { InMemoryEnrollmentsRepository } from '../../../../../test/repositories/in-memory-enrollments-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { InMemoryInstructorRepository } from './../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from './../../../../../test/repositories/in-memory-modules-repository'
import { InMemoryTagsRepository } from './../../../../../test/repositories/in-memory-tags-repository'
import { FetchCourseTagsUseCase } from './fetch-course-tags'

let inMemoryEnrollmentCompletedItemsRepository: InMemoryEnrollmentCompletedItemsRepository
let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryTagsRepository: InMemoryTagsRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: FetchCourseTagsUseCase

describe('Fetch tags of a course use case', () => {
  beforeEach(() => {
    inMemoryEnrollmentCompletedItemsRepository = new InMemoryEnrollmentCompletedItemsRepository()
    inMemoryClassesRepository = new InMemoryClassesRepository()
    inMemoryTagsRepository = new InMemoryTagsRepository()
    inMemoryCourseTagsRepository = new InMemoryCourseTagsRepository()
    inMemoryInstructorsRepository = new InMemoryInstructorRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)

    inMemoryEnrollmentsRepository = new InMemoryEnrollmentsRepository(
      inMemoryStudentsRepository, inMemoryEnrollmentCompletedItemsRepository
    )
    inMemoryCoursesRepository = new InMemoryCoursesRepository(inMemoryModulesRepository, inMemoryInstructorsRepository, inMemoryEnrollmentsRepository, inMemoryStudentsRepository, inMemoryCourseTagsRepository)

    sut = new FetchCourseTagsUseCase(
      inMemoryCoursesRepository,
      inMemoryCourseTagsRepository,
      inMemoryTagsRepository
    )
  })

  it('should be able to fetch course tags', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const firstTag = makeTag({ value: 'TYPESCRIPT' })
    const secondTag = makeTag({ value: 'VUEJS' })

    await Promise.all([
      inMemoryTagsRepository.create(firstTag),
      inMemoryTagsRepository.create(secondTag)
    ])

    const firstCourseTag = makeCourseTag({ courseId: course.id, tagId: firstTag.id })
    const secondCourseTag = makeCourseTag({ courseId: course.id, tagId: secondTag.id })

    await Promise.all([
      inMemoryCourseTagsRepository.create(firstCourseTag),
      inMemoryCourseTagsRepository.create(secondCourseTag)
    ])

    const result = await sut.exec({
      courseId: course.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      tags: expect.arrayContaining([
        expect.objectContaining({
          value: 'TYPESCRIPT'
        }),
        expect.objectContaining({
          value: 'VUEJS'
        })
      ])
    })
  })

  it('should not be able to fetch course tags from a inexistent course', async () => {
    const result = await sut.exec({
      courseId: 'inexistentCourseId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
