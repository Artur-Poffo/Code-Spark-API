import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeClass } from '../../../../../test/factories/make-class'
import { makeCourse } from '../../../../../test/factories/make-course'
import { makeEnrollment } from '../../../../../test/factories/make-enrollment'
import { makeEnrollmentCompletedItem } from '../../../../../test/factories/make-enrollment-completed-item'
import { makeInstructor } from '../../../../../test/factories/make-instructor'
import { makeModule } from '../../../../../test/factories/make-module'
import { makeStudent } from '../../../../../test/factories/make-student'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCourseTagsRepository } from '../../../../../test/repositories/in-memory-course-tags-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryEnrollmentCompletedItemsRepository } from '../../../../../test/repositories/in-memory-enrollment-completed-items-repository'
import { InMemoryEnrollmentsRepository } from '../../../../../test/repositories/in-memory-enrollments-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { InMemoryInstructorRepository } from './../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from './../../../../../test/repositories/in-memory-modules-repository'
import { FetchEnrollmentCompletedClassesUseCase } from './fetch-enrollment-completed-classes'

let inMemoryEnrollmentCompletedItemsRepository: InMemoryEnrollmentCompletedItemsRepository
let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: FetchEnrollmentCompletedClassesUseCase

describe('Fetch enrollment completed classes use case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryEnrollmentCompletedItemsRepository = new InMemoryEnrollmentCompletedItemsRepository()
    inMemoryCourseTagsRepository = new InMemoryCourseTagsRepository()
    inMemoryClassesRepository = new InMemoryClassesRepository()
    inMemoryInstructorsRepository = new InMemoryInstructorRepository()

    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)

    inMemoryEnrollmentsRepository = new InMemoryEnrollmentsRepository(
      inMemoryStudentsRepository, inMemoryEnrollmentCompletedItemsRepository
    )
    inMemoryCoursesRepository = new InMemoryCoursesRepository(
      inMemoryModulesRepository, inMemoryInstructorsRepository, inMemoryEnrollmentsRepository, inMemoryStudentsRepository, inMemoryCourseTagsRepository
    )

    sut = new FetchEnrollmentCompletedClassesUseCase(
      inMemoryEnrollmentsRepository,
      inMemoryEnrollmentCompletedItemsRepository
    )
  })

  it('should be able to fetch enrollment completed classes', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    const firstClassToMarkAsCompleted = makeClass({ name: 'John Doe Class 1', moduleId: module.id, classNumber: 1 })
    const secondClassToMarkAsCompleted = makeClass({ name: 'John Doe Class 2', moduleId: module.id, classNumber: 2 })

    await Promise.all([
      inMemoryClassesRepository.create(firstClassToMarkAsCompleted),
      inMemoryClassesRepository.create(secondClassToMarkAsCompleted)
    ])

    const student = makeStudent()
    await inMemoryStudentsRepository.create(student)

    const enrollment = makeEnrollment({ studentId: student.id, courseId: course.id })
    await inMemoryEnrollmentsRepository.create(enrollment)

    const firstCompletedItem = makeEnrollmentCompletedItem({ itemId: firstClassToMarkAsCompleted.id, enrollmentId: enrollment.id, type: 'CLASS' })
    const secondCompletedItem = makeEnrollmentCompletedItem({ itemId: secondClassToMarkAsCompleted.id, enrollmentId: enrollment.id, type: 'CLASS' })

    await Promise.all([
      inMemoryEnrollmentCompletedItemsRepository.create(firstCompletedItem),
      inMemoryEnrollmentCompletedItemsRepository.create(secondCompletedItem)
    ])

    const result = await sut.exec({
      enrollmentId: enrollment.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      completedClasses: expect.arrayContaining([
        expect.objectContaining({
          itemId: firstCompletedItem.itemId
        }),
        expect.objectContaining({
          itemId: secondCompletedItem.itemId
        })
      ])
    })
    expect(inMemoryEnrollmentCompletedItemsRepository.items).toHaveLength(2)
  })

  it('should not be able to fetch enrollment completed classes from a inexistent enrollment', async () => {
    const result = await sut.exec({
      enrollmentId: 'inexistentEnrollmentId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
