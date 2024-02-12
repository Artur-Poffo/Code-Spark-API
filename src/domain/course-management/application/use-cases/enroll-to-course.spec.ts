import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCourse } from '../../../../../test/factories/make-course'
import { makeStudent } from '../../../../../test/factories/make-student'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCourseTagsRepository } from '../../../../../test/repositories/in-memory-course-tags-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryEnrollmentsRepository } from '../../../../../test/repositories/in-memory-enrollments-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { InMemoryInstructorRepository } from './../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from './../../../../../test/repositories/in-memory-modules-repository'
import { EnrollToCourseUseCase } from './enroll-to-course'
import { AlreadyEnrolledInThisCourse } from './errors/already-enrolled-in-this-course'

let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: EnrollToCourseUseCase

describe('Enroll to course use case', () => {
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

    sut = new EnrollToCourseUseCase(inMemoryEnrollmentsRepository, inMemoryStudentsRepository, inMemoryCoursesRepository)
  })

  it('should be able to enroll to a course', async () => {
    const student = makeStudent()
    await inMemoryStudentsRepository.create(student)

    const course = makeCourse()
    await inMemoryCoursesRepository.create(course)

    const result = await sut.exec({
      studentId: student.id.toString(),
      courseId: course.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      enrollment: expect.objectContaining({
        studentId: student.id
      })
    })
  })

  it('should not be able to enroll to a inexistent course', async () => {
    const student = makeStudent()
    await inMemoryStudentsRepository.create(student)

    const result = await sut.exec({
      studentId: student.id.toString(),
      courseId: 'inexistentCourseId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('an student should not be able to enroll to a course twice', async () => {
    const student = makeStudent()
    await inMemoryStudentsRepository.create(student)

    const course = makeCourse()
    await inMemoryCoursesRepository.create(course)

    await sut.exec({
      studentId: student.id.toString(),
      courseId: course.id.toString()
    })

    const result = await sut.exec({
      studentId: student.id.toString(),
      courseId: course.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyEnrolledInThisCourse)
  })
})
