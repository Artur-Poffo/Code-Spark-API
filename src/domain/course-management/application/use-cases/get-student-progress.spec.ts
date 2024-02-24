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
import { InMemoryInstructorRepository } from '../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from '../../../../../test/repositories/in-memory-modules-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { GetStudentProgressUseCase } from './get-student-progress'

let inMemoryEnrollmentCompletedItemsRepository: InMemoryEnrollmentCompletedItemsRepository
let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: GetStudentProgressUseCase

describe('Get student progress use case', () => {
  beforeEach(() => {
    inMemoryEnrollmentCompletedItemsRepository = new InMemoryEnrollmentCompletedItemsRepository()
    inMemoryClassesRepository = new InMemoryClassesRepository()
    inMemoryCourseTagsRepository = new InMemoryCourseTagsRepository()
    inMemoryInstructorsRepository = new InMemoryInstructorRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)

    inMemoryEnrollmentsRepository = new InMemoryEnrollmentsRepository(
      inMemoryStudentsRepository, inMemoryEnrollmentCompletedItemsRepository
    )
    inMemoryCoursesRepository = new InMemoryCoursesRepository(inMemoryModulesRepository, inMemoryInstructorsRepository, inMemoryEnrollmentsRepository, inMemoryStudentsRepository, inMemoryCourseTagsRepository)

    sut = new GetStudentProgressUseCase(
      inMemoryEnrollmentsRepository,
      inMemoryCoursesRepository,
      inMemoryModulesRepository,
      inMemoryEnrollmentCompletedItemsRepository
    )
  })

  it('should be able to get student progress in a course', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ name: 'First Course', instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const module = makeModule({
      name: 'John Doe Module',
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    const classToAdd = makeClass({ name: 'John Doe Class', moduleId: module.id, classNumber: 1 })
    await inMemoryClassesRepository.create(classToAdd)

    const student = makeStudent()
    await inMemoryStudentsRepository.create(student)

    const enrollment = makeEnrollment({ studentId: student.id, courseId: course.id })
    await inMemoryEnrollmentsRepository.create(enrollment)

    const completedItem = makeEnrollmentCompletedItem({ enrollmentId: enrollment.id, itemId: classToAdd.id, type: 'CLASS' })
    await inMemoryEnrollmentCompletedItemsRepository.create(completedItem)

    const result = await sut.exec({
      enrollmentId: enrollment.id.toString(),
      studentId: student.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      classes: expect.arrayContaining([
        expect.objectContaining({
          class: expect.objectContaining({
            name: 'John Doe Class'
          }),
          completed: true
        })
      ]),
      modules: expect.arrayContaining([
        expect.objectContaining({
          module: expect.objectContaining({
            name: 'John Doe Module'
          }),
          completed: false
        })
      ])
    })
  })

  it('should not be able to get a student progress from a inexistent enrollment', async () => {
    const result = await sut.exec({
      enrollmentId: 'inexistentEnrollmentId',
      studentId: 'inexistentStudentId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
