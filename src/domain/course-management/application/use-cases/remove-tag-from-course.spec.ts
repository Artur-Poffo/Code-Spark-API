import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
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
import { InMemoryInstructorRepository } from '../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from '../../../../../test/repositories/in-memory-modules-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { InMemoryTagsRepository } from '../../../../../test/repositories/in-memory-tags-repository'
import { RemoveTagFromCourseUseCase } from './remove-tag-from-course'

let inMemoryEnrollmentCompletedItemsRepository: InMemoryEnrollmentCompletedItemsRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryTagsRepository: InMemoryTagsRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: RemoveTagFromCourseUseCase

describe('Remove tag from course use case', () => {
  beforeEach(() => {
    inMemoryEnrollmentCompletedItemsRepository = new InMemoryEnrollmentCompletedItemsRepository()
    inMemoryCourseTagsRepository = new InMemoryCourseTagsRepository()
    inMemoryTagsRepository = new InMemoryTagsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryClassesRepository = new InMemoryClassesRepository()
    inMemoryInstructorsRepository = new InMemoryInstructorRepository()

    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)

    inMemoryEnrollmentsRepository = new InMemoryEnrollmentsRepository(
      inMemoryStudentsRepository, inMemoryEnrollmentCompletedItemsRepository
    )
    inMemoryCoursesRepository = new InMemoryCoursesRepository(inMemoryModulesRepository, inMemoryInstructorsRepository, inMemoryEnrollmentsRepository, inMemoryStudentsRepository, inMemoryCourseTagsRepository)

    sut = new RemoveTagFromCourseUseCase(
      inMemoryTagsRepository,
      inMemoryCoursesRepository,
      inMemoryInstructorsRepository,
      inMemoryCourseTagsRepository
    )
  })

  it('should be able to remove a tag from a course', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const tag = makeTag({ value: 'TYPESCRIPT' })
    await inMemoryTagsRepository.create(tag)

    const courseTag = makeCourseTag({ courseId: course.id, tagId: tag.id })
    await inMemoryCourseTagsRepository.create(courseTag)

    const result = await sut.exec({
      tagId: tag.id.toString(),
      courseId: course.id.toString(),
      instructorId: course.instructorId.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      tag: expect.objectContaining({
        value: 'TYPESCRIPT'
      })
    })
    expect(inMemoryCourseTagsRepository.items).toHaveLength(0)
  })

  it('should not be able to remove a inexistent tag from a course', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const result = await sut.exec({
      tagId: 'inexistentTagId',
      courseId: course.id.toString(),
      instructorId: course.instructorId.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to remove a tag from a course if the instructor not is the owner', async () => {
    const owner = makeInstructor()
    const wrongInstructor = makeInstructor()

    await Promise.all([
      inMemoryInstructorsRepository.create(owner),
      inMemoryInstructorsRepository.create(wrongInstructor)
    ])

    const course = makeCourse({ instructorId: owner.id })
    await inMemoryCoursesRepository.create(course)

    const tag = makeTag({ value: 'TYPESCRIPT' })
    await inMemoryTagsRepository.create(tag)

    const courseTag = makeCourseTag({ courseId: course.id, tagId: tag.id })
    await inMemoryCourseTagsRepository.create(courseTag)

    const result = await sut.exec({
      tagId: tag.id.toString(),
      courseId: course.id.toString(),
      instructorId: wrongInstructor.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
