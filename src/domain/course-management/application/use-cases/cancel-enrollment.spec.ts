import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCourse } from '../../../../../test/factories/make-course'
import { makeEnrollment } from '../../../../../test/factories/make-enrollment'
import { makeStudent } from '../../../../../test/factories/make-student'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCourseTagsRepository } from '../../../../../test/repositories/in-memory-course-tags-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryEnrollmentsRepository } from '../../../../../test/repositories/in-memory-enrollments-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { InMemoryInstructorRepository } from './../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from './../../../../../test/repositories/in-memory-modules-repository'
import { CancelEnrollmentUseCase } from './cancel-enrollment'

let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: CancelEnrollmentUseCase

describe('Cancel enrollment use case', () => {
  beforeEach(() => {
    inMemoryClassesRepository = new InMemoryClassesRepository()
    inMemoryCourseTagsRepository = new InMemoryCourseTagsRepository()
    inMemoryInstructorsRepository = new InMemoryInstructorRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)

    inMemoryEnrollmentsRepository = new InMemoryEnrollmentsRepository(
      inMemoryClassesRepository, inMemoryModulesRepository, inMemoryStudentsRepository
    )
    inMemoryCoursesRepository = new InMemoryCoursesRepository(inMemoryModulesRepository, inMemoryInstructorsRepository, inMemoryEnrollmentsRepository, inMemoryStudentsRepository, inMemoryCourseTagsRepository)

    sut = new CancelEnrollmentUseCase(
      inMemoryEnrollmentsRepository,
      inMemoryStudentsRepository
    )
  })

  it('should be able to cancel a enrollment', async () => {
    const course = makeCourse()
    await inMemoryCoursesRepository.create(course)

    const student = makeStudent()
    await inMemoryStudentsRepository.create(student)

    const enrollment = makeEnrollment({ courseId: course.id, studentId: student.id })
    await inMemoryEnrollmentsRepository.create(enrollment)

    const result = await sut.exec({
      enrollmentId: enrollment.id.toString(),
      studentId: student.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      enrollment: expect.objectContaining({
        studentId: student.id,
        courseId: course.id
      })
    })
    expect(inMemoryEnrollmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to cancel a inexistent enrollment', async () => {
    const result = await sut.exec({
      enrollmentId: 'inexistentEnrollmentId',
      studentId: 'inexistentStudentId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to cancel a enrollment if the student not is the owner', async () => {
    const course = makeCourse()
    await inMemoryCoursesRepository.create(course)

    const correctStudent = makeStudent()
    const wrongStudent = makeStudent()

    await Promise.all([
      inMemoryStudentsRepository.create(correctStudent),
      inMemoryStudentsRepository.create(wrongStudent)
    ])

    const enrollment = makeEnrollment({ courseId: course.id, studentId: correctStudent.id })
    await inMemoryEnrollmentsRepository.create(enrollment)

    const result = await sut.exec({
      enrollmentId: enrollment.id.toString(),
      studentId: wrongStudent.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
