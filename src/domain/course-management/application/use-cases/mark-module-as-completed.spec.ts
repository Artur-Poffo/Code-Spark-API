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
import { AllClassesInTheModuleMustBeMarkedAsCompleted } from './errors/all-classes-in-the-module-must-be-marked-as-completed'
import { MarkModuleAsCompletedUseCase } from './mark-module-as-completed'

let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: MarkModuleAsCompletedUseCase

describe('Mark module as completed use case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryCourseTagsRepository = new InMemoryCourseTagsRepository()
    inMemoryClassesRepository = new InMemoryClassesRepository()
    inMemoryInstructorsRepository = new InMemoryInstructorRepository()

    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)

    inMemoryEnrollmentsRepository = new InMemoryEnrollmentsRepository(
      inMemoryClassesRepository, inMemoryModulesRepository
    )
    inMemoryCoursesRepository = new InMemoryCoursesRepository(
      inMemoryModulesRepository, inMemoryInstructorsRepository, inMemoryEnrollmentsRepository, inMemoryStudentsRepository, inMemoryCourseTagsRepository
    )

    sut = new MarkModuleAsCompletedUseCase(
      inMemoryEnrollmentsRepository, inMemoryModulesRepository, inMemoryClassesRepository, inMemoryStudentsRepository
    )
  })

  it('should be able to mark a module of a enrollment as completed', async () => {
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

    const student = makeStudent()
    await inMemoryStudentsRepository.create(student)

    const enrollment = makeEnrollment({ studentId: student.id, courseId: course.id })
    await inMemoryEnrollmentsRepository.create(enrollment)

    await inMemoryEnrollmentsRepository.markClassAsCompleted(classToAdd.id.toString(), enrollment)

    const result = await sut.exec({
      enrollmentId: enrollment.id.toString(),
      moduleId: module.id.toString(),
      studentId: student.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      module: expect.objectContaining({
        name: 'John Doe Module'
      })
    })
  })

  it('should be able to mark a inexistent module of a enrollment as completed', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const student = makeStudent()
    await inMemoryStudentsRepository.create(student)

    const enrollment = makeEnrollment({ studentId: student.id, courseId: course.id })
    await inMemoryEnrollmentsRepository.create(enrollment)

    const result = await sut.exec({
      enrollmentId: enrollment.id.toString(),
      moduleId: 'inexistentModuleId',
      studentId: student.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to mark a module of a enrollment as completed if the student not is the owner of the enrollment', async () => {
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
      moduleId: module.id.toString(),
      studentId: wrongStudent.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to mark a module of an enrollment as completed if any class within it is not completed', async () => {
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

    const notCompletedClass = makeClass({ name: 'John Doe Class', moduleId: module.id, classNumber: 1 })
    await inMemoryClassesRepository.create(notCompletedClass)

    const student = makeStudent()
    await inMemoryStudentsRepository.create(student)

    const enrollment = makeEnrollment({ studentId: student.id, courseId: course.id })
    await inMemoryEnrollmentsRepository.create(enrollment)

    // Not mark class of the module as completed

    const result = await sut.exec({
      enrollmentId: enrollment.id.toString(),
      moduleId: module.id.toString(),
      studentId: student.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AllClassesInTheModuleMustBeMarkedAsCompleted)
  })
})
