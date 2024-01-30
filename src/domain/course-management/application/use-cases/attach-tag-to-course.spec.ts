import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCourse } from '../../../../../test/factories/make-course'
import { makeInstructor } from '../../../../../test/factories/make-instructor'
import { makeTag } from '../../../../../test/factories/make-tag'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCourseTagsRepository } from '../../../../../test/repositories/in-memory-course-tags-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryInstructorRepository } from '../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from '../../../../../test/repositories/in-memory-modules-repository'
import { InMemoryTagsRepository } from '../../../../../test/repositories/in-memory-tags-repository'
import { AttachTagToCourseUseCase } from './attach-tag-to-course'
import { TagAlreadyAttachedError } from './errors/tag-already-attached-error'

let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryTagsRepository: InMemoryTagsRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let sut: AttachTagToCourseUseCase

describe('Attach tag to course use case', () => {
  beforeEach(() => {
    inMemoryCourseTagsRepository = new InMemoryCourseTagsRepository()
    inMemoryTagsRepository = new InMemoryTagsRepository()
    inMemoryModulesRepository = new InMemoryModulesRepository()
    inMemoryClassesRepository = new InMemoryClassesRepository(inMemoryModulesRepository)
    inMemoryInstructorsRepository = new InMemoryInstructorRepository(inMemoryCoursesRepository)
    inMemoryCoursesRepository = new InMemoryCoursesRepository(inMemoryModulesRepository, inMemoryClassesRepository, inMemoryInstructorsRepository)
    sut = new AttachTagToCourseUseCase(inMemoryCourseTagsRepository, inMemoryCoursesRepository)
  })

  it('should be able to attach a new tag for a course', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse()
    await inMemoryCoursesRepository.create(course)

    const tag = makeTag({ value: 'TYPESCRIPT' })
    await inMemoryTagsRepository.create(tag)

    const result = await sut.exec({
      courseId: course.id.toString(),
      tagId: tag.id.toString(),
      instructorId: course.instructorId.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      attachedTag: expect.objectContaining({
        courseId: course.id,
        tagId: tag.id
      })
    })
  })

  it('should not be able to attach a new tag for a inexistent course', async () => {
    const tag = makeTag({ value: 'TYPESCRIPT' })
    await inMemoryTagsRepository.create(tag)

    const result = await sut.exec({
      courseId: 'inexistentCourse',
      tagId: tag.id.toString(),
      instructorId: 'inexistentInstructor'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to attach a new tag for a course if the instructor not is the sponsor', async () => {
    const sponsor = makeInstructor()
    const wrongInstructor = makeInstructor()

    await Promise.all([
      inMemoryInstructorsRepository.create(sponsor),
      inMemoryInstructorsRepository.create(wrongInstructor)
    ])

    const course = makeCourse({ instructorId: sponsor.id })
    await inMemoryCoursesRepository.create(course)

    const tag = makeTag({ value: 'TYPESCRIPT' })
    await inMemoryTagsRepository.create(tag)

    const result = await sut.exec({
      courseId: course.id.toString(),
      tagId: tag.id.toString(),
      instructorId: wrongInstructor.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to attach a same tag for a course twice', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse()
    await inMemoryCoursesRepository.create(course)

    const tag = makeTag({ value: 'TYPESCRIPT' })
    await inMemoryTagsRepository.create(tag)

    await sut.exec({
      courseId: course.id.toString(),
      tagId: tag.id.toString(),
      instructorId: course.instructorId.toString()
    })

    const result = await sut.exec({
      courseId: course.id.toString(),
      tagId: tag.id.toString(),
      instructorId: course.instructorId.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(TagAlreadyAttachedError)
  })
})
