import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeClass } from '../../../../../test/factories/make-class'
import { makeCourse } from '../../../../../test/factories/make-course'
import { makeEnrollment } from '../../../../../test/factories/make-enrollment'
import { makeInstructor } from '../../../../../test/factories/make-instructor'
import { makeModule } from '../../../../../test/factories/make-module'
import { makeStudent } from '../../../../../test/factories/make-student'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { InMemoryCourseTagsRepository } from '../../../../../test/repositories/in-memory-course-tags-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryEnrollmentsRepository } from '../../../../../test/repositories/in-memory-enrollments-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { InMemoryInstructorRepository } from './../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from './../../../../../test/repositories/in-memory-modules-repository'
import { AllModulesInTheCourseMustBeMarkedAsCompleted } from './errors/all-modules-in-the-course-must-be-marked-as-completed'
import { MarkCourseAsCompletedUseCase } from './mark-course-as-completed'

let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: MarkCourseAsCompletedUseCase

describe('Mark course as completed use case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryCourseTagsRepository = new InMemoryCourseTagsRepository()
    inMemoryClassesRepository = new InMemoryClassesRepository()
    inMemoryInstructorsRepository = new InMemoryInstructorRepository()

    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)

    inMemoryEnrollmentsRepository = new InMemoryEnrollmentsRepository(
      inMemoryClassesRepository, inMemoryModulesRepository, inMemoryStudentsRepository
    )
    inMemoryCoursesRepository = new InMemoryCoursesRepository(
      inMemoryModulesRepository, inMemoryInstructorsRepository, inMemoryEnrollmentsRepository, inMemoryStudentsRepository, inMemoryCourseTagsRepository
    )

    sut = new MarkCourseAsCompletedUseCase(
      inMemoryEnrollmentsRepository, inMemoryCoursesRepository, inMemoryModulesRepository, inMemoryStudentsRepository
    )
  })

  it('should be able to mark a enrollment of a student as completed', async () => {
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
    expect(inMemoryEnrollmentsRepository.items[0].completedAt).not.toBe(null)
  })

  it('should not be able to mark a inexistent enrollment of a student as completed', async () => {
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

    const result = await sut.exec({
      enrollmentId: 'inexistentEnrollmentId',
      studentId: student.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to mark a enrollment of a student as completed if the student not is the owner of the enrollment', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const module = makeModule({
      name: 'John Doe Module',
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    const classToAdd = makeClass({ name: 'John Doe Class', moduleId: module.id, classNumber: 1 })
    await inMemoryClassesRepository.create(classToAdd)

    const correctStudent = makeStudent()
    const wrongStudent = makeStudent()

    await Promise.all([
      inMemoryStudentsRepository.create(correctStudent),
      inMemoryStudentsRepository.create(wrongStudent)
    ])

    const enrollment = makeEnrollment({ studentId: correctStudent.id, courseId: course.id })
    await inMemoryEnrollmentsRepository.create(enrollment)

    await inMemoryEnrollmentsRepository.markClassAsCompleted(classToAdd.id.toString(), enrollment)

    const result = await sut.exec({
      enrollmentId: enrollment.id.toString(),
      studentId: wrongStudent.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to mark a enrollment of a student as completed if any module within it is not completed', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const notCompletedModule = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(notCompletedModule)

    const classToMarkAsCompleted = makeClass({ name: 'John Doe Class', moduleId: notCompletedModule.id, classNumber: 1 })
    await inMemoryClassesRepository.create(classToMarkAsCompleted)

    const student = makeStudent()
    await inMemoryStudentsRepository.create(student)

    const enrollment = makeEnrollment({ studentId: student.id, courseId: course.id })
    await inMemoryEnrollmentsRepository.create(enrollment)

    // Not mark module as completed

    const result = await sut.exec({
      enrollmentId: enrollment.id.toString(),
      studentId: student.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AllModulesInTheCourseMustBeMarkedAsCompleted)
  })
})
