import { makeCourse } from '../../../../../test/factories/make-course'
import { makeCourseTag } from '../../../../../test/factories/make-course-tag'
import { makeInstructor } from '../../../../../test/factories/make-instructor'
import { makeTag } from '../../../../../test/factories/make-tag'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCourseTagsRepository } from '../../../../../test/repositories/in-memory-course-tags-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryEnrollmentsRepository } from '../../../../../test/repositories/in-memory-enrollments-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { InMemoryTagsRepository } from '../../../../../test/repositories/in-memory-tags-repository'
import { InMemoryInstructorRepository } from './../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from './../../../../../test/repositories/in-memory-modules-repository'
import { QueryCoursesByTagsUseCase } from './query-courses-by-tags'

let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryTagsRepository: InMemoryTagsRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: QueryCoursesByTagsUseCase

describe('Query courses by tags use case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryCourseTagsRepository = new InMemoryCourseTagsRepository()
    inMemoryTagsRepository = new InMemoryTagsRepository()
    inMemoryClassesRepository = new InMemoryClassesRepository()
    inMemoryInstructorsRepository = new InMemoryInstructorRepository()

    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)

    inMemoryEnrollmentsRepository = new InMemoryEnrollmentsRepository(
      inMemoryClassesRepository, inMemoryModulesRepository
    )
    inMemoryCoursesRepository = new InMemoryCoursesRepository(
      inMemoryModulesRepository, inMemoryInstructorsRepository, inMemoryEnrollmentsRepository, inMemoryStudentsRepository, inMemoryCourseTagsRepository
    )

    sut = new QueryCoursesByTagsUseCase(
      inMemoryCoursesRepository,
      inMemoryTagsRepository
    )
  })

  it('should be able to query courses by tags', async () => {
    const firstTag = makeTag({ value: 'TYPESCRIPT' })
    const secondTag = makeTag({ value: 'NEXT' })

    await Promise.all([
      inMemoryTagsRepository.create(firstTag),
      inMemoryTagsRepository.create(secondTag)
    ])

    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ name: 'John Doe Course', instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const firstCourseTag = makeCourseTag({ courseId: course.id, tagId: firstTag.id })
    const secondCourseTag = makeCourseTag({ courseId: course.id, tagId: secondTag.id })

    await Promise.all([
      inMemoryCourseTagsRepository.create(firstCourseTag),
      inMemoryCourseTagsRepository.create(secondCourseTag)
    ])

    const result = await sut.exec({
      query: 'n' // Of Next
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      courses: expect.arrayContaining([
        expect.objectContaining({
          name: 'John Doe Course'
        })
      ])
    })
  })
})
