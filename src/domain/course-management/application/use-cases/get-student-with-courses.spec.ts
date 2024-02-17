import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCourse } from '../../../../../test/factories/make-course'
import { makeEnrollment } from '../../../../../test/factories/make-enrollment'
import { makeInstructor } from '../../../../../test/factories/make-instructor'
import { makeStudent } from '../../../../../test/factories/make-student'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCourseTagsRepository } from '../../../../../test/repositories/in-memory-course-tags-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryEnrollmentCompletedItemsRepository } from '../../../../../test/repositories/in-memory-enrollment-completed-items-repository'
import { InMemoryEnrollmentsRepository } from '../../../../../test/repositories/in-memory-enrollments-repository'
import { InMemoryInstructorRepository } from '../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from '../../../../../test/repositories/in-memory-modules-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { GetStudentWithCoursesUseCase } from './get-student-with-courses'

let inMemoryEnrollmentCompletedItemsRepository: InMemoryEnrollmentCompletedItemsRepository
let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: GetStudentWithCoursesUseCase

describe('Get student with their courses', () => {
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

    sut = new GetStudentWithCoursesUseCase(inMemoryCoursesRepository)
  })

  it('should be able to get a student info with their courses', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const firstCourse = makeCourse({ name: 'First Course', instructorId: instructor.id })
    const secondCourse = makeCourse({ name: 'Second Course', instructorId: instructor.id })

    await Promise.all([
      inMemoryCoursesRepository.create(firstCourse),
      inMemoryCoursesRepository.create(secondCourse)
    ])

    const student = makeStudent()
    await inMemoryStudentsRepository.create(student)

    const firstEnrollment = makeEnrollment({ courseId: firstCourse.id, studentId: student.id })
    const secondEnrollment = makeEnrollment({ courseId: secondCourse.id, studentId: student.id })

    await Promise.all([
      inMemoryEnrollmentsRepository.create(firstEnrollment),
      inMemoryEnrollmentsRepository.create(secondEnrollment)
    ])

    const result = await sut.exec({
      studentId: student.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      studentWithCourses: expect.objectContaining({
        courses: expect.arrayContaining([
          expect.objectContaining({
            name: 'First Course'
          }),
          expect.objectContaining({
            name: 'Second Course'
          })
        ])
      })
    })
  })

  it('should not be able to get a inexistent student info with their courses', async () => {
    const result = await sut.exec({
      studentId: 'inexistentStudentId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
