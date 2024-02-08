import { makeClass } from '../../../../../test/factories/make-class'
import { makeCourse } from '../../../../../test/factories/make-course'
import { makeEnrollment } from '../../../../../test/factories/make-enrollment'
import { makeInstructor } from '../../../../../test/factories/make-instructor'
import { makeModule } from '../../../../../test/factories/make-module'
import { makeStudent } from '../../../../../test/factories/make-student'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryEnrollmentsRepository } from '../../../../../test/repositories/in-memory-enrollments-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { InMemoryInstructorRepository } from './../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from './../../../../../test/repositories/in-memory-modules-repository'
import { MarkCourseAsCompletedUseCase } from './mark-course-as-completed'

let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: MarkCourseAsCompletedUseCase

describe('Mark course as completed use case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryClassesRepository = new InMemoryClassesRepository()
    inMemoryInstructorsRepository = new InMemoryInstructorRepository()

    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)

    inMemoryEnrollmentsRepository = new InMemoryEnrollmentsRepository(
      inMemoryClassesRepository, inMemoryModulesRepository
    )
    inMemoryCoursesRepository = new InMemoryCoursesRepository(
      inMemoryModulesRepository, inMemoryInstructorsRepository, inMemoryEnrollmentsRepository, inMemoryStudentsRepository
    )

    sut = new MarkCourseAsCompletedUseCase(
      inMemoryEnrollmentsRepository, inMemoryCoursesRepository, inMemoryModulesRepository, inMemoryStudentsRepository
    )
  })

  it('should be able to mark a enrollment of a course as completed', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    const classToMarkAsCompleted = makeClass({ name: 'John Doe Class', moduleId: module.id, classNumber: 1 })
    await inMemoryClassesRepository.create(classToMarkAsCompleted)

    const student = makeStudent()
    await inMemoryStudentsRepository.create(student)

    const enrollment = makeEnrollment({ studentId: student.id, courseId: course.id })
    await inMemoryEnrollmentsRepository.create(enrollment)

    await inMemoryEnrollmentsRepository.markClassAsCompleted(classToMarkAsCompleted.id.toString(), enrollment)
    await inMemoryEnrollmentsRepository.markModuleAsCompleted(module.id.toString(), enrollment)

    const result = await sut.exec({
      enrollmentId: enrollment.id.toString(),
      studentId: student.id.toString()
    })

    expect(result.isRight()).toBe(true)
  })
})
