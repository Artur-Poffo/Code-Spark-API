import { makeCourse } from '../../../../../test/factories/make-course'
import { makeEnrollment } from '../../../../../test/factories/make-enrollment'
import { makeStudent } from '../../../../../test/factories/make-student'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCourseTagsRepository } from '../../../../../test/repositories/in-memory-course-tags-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryEnrollmentsRepository } from '../../../../../test/repositories/in-memory-enrollments-repository'
import { InMemoryInstructorRepository } from '../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from '../../../../../test/repositories/in-memory-modules-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { GetCourseWithStudentsUseCase } from './get-course-with-students'

let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: GetCourseWithStudentsUseCase

describe('Get course details with students use case', () => {
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

    sut = new GetCourseWithStudentsUseCase(inMemoryCoursesRepository)
  })

  it('should be able to get course details with their registered students', async () => {
    const course = makeCourse({ name: 'John Doe Course' })
    await inMemoryCoursesRepository.create(course)

    const firstStudent = makeStudent()
    const secondStudent = makeStudent()

    await Promise.all([
      inMemoryStudentsRepository.create(firstStudent),
      inMemoryStudentsRepository.create(secondStudent)
    ])

    const firstStudentEnrollment = makeEnrollment({ studentId: firstStudent.id, courseId: course.id })
    const secondStudentEnrollment = makeEnrollment({ studentId: secondStudent.id, courseId: course.id })

    await Promise.all([
      inMemoryEnrollmentsRepository.create(firstStudentEnrollment),
      inMemoryEnrollmentsRepository.create(secondStudentEnrollment)
    ])

    const result = await sut.exec({
      courseId: course.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      courseWithStudents: expect.objectContaining({
        course: expect.objectContaining({
          name: 'John Doe Course'
        }),
        students: expect.arrayContaining([
          expect.objectContaining({
            id: firstStudent.id
          }),
          expect.objectContaining({
            id: secondStudent.id
          })
        ])
      })
    })
  })
})
