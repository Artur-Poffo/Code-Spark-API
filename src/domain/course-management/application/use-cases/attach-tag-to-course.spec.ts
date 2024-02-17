import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCourse } from '../../../../../test/factories/make-course'
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
import { AttachTagToCourseUseCase } from './attach-tag-to-course'
import { RepeatedTagError } from './errors/repeated-tag-error'
import { TagAlreadyAttachedError } from './errors/tag-already-attached-error'

let inMemoryEnrollmentCompletedItemsRepository: InMemoryEnrollmentCompletedItemsRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryTagsRepository: InMemoryTagsRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: AttachTagToCourseUseCase

describe('Attach tag to course use case', () => {
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

    sut = new AttachTagToCourseUseCase(inMemoryCourseTagsRepository, inMemoryTagsRepository, inMemoryCoursesRepository)
  })

  it('should be able to attach a tag for a course', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse()
    await inMemoryCoursesRepository.create(course)

    const tag = makeTag({ value: 'TYPESCRIPT' })
    await inMemoryTagsRepository.create(tag)

    const result = await sut.exec({
      tagIds: [tag.id.toString()],
      courseId: course.id.toString(),
      instructorId: course.instructorId.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      attachedTags: expect.arrayContaining([
        expect.objectContaining({
          tagId: tag.id,
          courseId: course.id
        })
      ])
    })
  })

  it('should be able to attach many tags for a course at same time', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse()
    await inMemoryCoursesRepository.create(course)

    const firstTag = makeTag({ value: 'TYPESCRIPT' })
    const secondTag = makeTag({ value: 'VUE.JS' })

    const firstTagAndSecondTag = await Promise.all([
      inMemoryTagsRepository.create(firstTag),
      inMemoryTagsRepository.create(secondTag)
    ])

    const result = await sut.exec({
      tagIds: [firstTagAndSecondTag[0].id.toString(), firstTagAndSecondTag[1].id.toString()],
      courseId: course.id.toString(),
      instructorId: course.instructorId.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      attachedTags: expect.arrayContaining([
        expect.objectContaining({
          tagId: firstTagAndSecondTag[0].id,
          courseId: course.id
        }),
        expect.objectContaining({
          tagId: firstTagAndSecondTag[1].id,
          courseId: course.id
        })
      ])
    })
  })

  it('should not be able to attach a inexistent tag for a course', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse()
    await inMemoryCoursesRepository.create(course)

    const result = await sut.exec({
      tagIds: ['inexistentTag'],
      courseId: course.id.toString(),
      instructorId: course.instructorId.toString()
    })

    expect(result.isRight()).toBe(true) // OK
    expect(result.value).toMatchObject({ // But not attach any tag
      attachedTags: []
    })
  })

  it('should not be able to attach a tag for a inexistent course', async () => {
    const tag = makeTag({ value: 'TYPESCRIPT' })
    await inMemoryTagsRepository.create(tag)

    const result = await sut.exec({
      tagIds: [tag.id.toString()],
      courseId: 'inexistentCourse',
      instructorId: 'inexistentInstructor'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to attach a tag for a course if the instructor not is the owner', async () => {
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

    const result = await sut.exec({
      tagIds: [tag.id.toString()],
      courseId: course.id.toString(),
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
      tagIds: [tag.id.toString()],
      courseId: course.id.toString(),
      instructorId: course.instructorId.toString()
    })

    const result = await sut.exec({
      tagIds: [tag.id.toString()],
      courseId: course.id.toString(),
      instructorId: course.instructorId.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(TagAlreadyAttachedError)
  })

  it('should not be able to attach a same tag for a course twice at same time', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse()
    await inMemoryCoursesRepository.create(course)

    const tag = makeTag({ value: 'TYPESCRIPT' })
    await inMemoryTagsRepository.create(tag)

    const result = await sut.exec({
      tagIds: [tag.id.toString(), tag.id.toString()], // Same tag twice
      courseId: course.id.toString(),
      instructorId: course.instructorId.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(RepeatedTagError)
  })
})
