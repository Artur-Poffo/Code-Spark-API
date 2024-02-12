import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeClass } from '../../../../../test/factories/make-class'
import { makeCourse } from '../../../../../test/factories/make-course'
import { makeEnrollment } from '../../../../../test/factories/make-enrollment'
import { makeInstructor } from '../../../../../test/factories/make-instructor'
import { makeModule } from '../../../../../test/factories/make-module'
import { makeStudent } from '../../../../../test/factories/make-student'
import { InMemoryClassesRepository } from '../../../../../test/repositories/in-memory-classes-repository'
import { type InMemoryCourseTagsRepository } from '../../../../../test/repositories/in-memory-course-tags-repository'
import { InMemoryCoursesRepository } from '../../../../../test/repositories/in-memory-courses-repository'
import { InMemoryEnrollmentsRepository } from '../../../../../test/repositories/in-memory-enrollments-repository'
import { InMemoryEvaluationsRepository } from '../../../../../test/repositories/in-memory-evaluations-repository'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { InMemoryInstructorRepository } from './../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from './../../../../../test/repositories/in-memory-modules-repository'
import { InvalidEvaluationValueError } from './errors/invalid-evaluation-value-error'
import { StudentAlreadyEvaluateThisClassError } from './errors/student-already-evaluate-this-class-error'
import { StudentMustBeRegisteredToEvaluateError } from './errors/student-must-be-registered-to-evaluate-error'
import { EvaluateClassUseCase } from './evaluate-class'

let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryEvaluationsRepository: InMemoryEvaluationsRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: EvaluateClassUseCase

describe('Evaluate class use case', () => {
  beforeEach(() => {
    inMemoryClassesRepository = new InMemoryClassesRepository()
    inMemoryInstructorsRepository = new InMemoryInstructorRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)

    inMemoryEvaluationsRepository = new InMemoryEvaluationsRepository(inMemoryModulesRepository)
    inMemoryEnrollmentsRepository = new InMemoryEnrollmentsRepository(
      inMemoryClassesRepository, inMemoryModulesRepository, inMemoryStudentsRepository
    )
    inMemoryCoursesRepository = new InMemoryCoursesRepository(inMemoryModulesRepository, inMemoryInstructorsRepository, inMemoryEnrollmentsRepository, inMemoryStudentsRepository, inMemoryCourseTagsRepository)

    sut = new EvaluateClassUseCase(
      inMemoryEvaluationsRepository,
      inMemoryStudentsRepository,
      inMemoryCoursesRepository,
      inMemoryClassesRepository,
      inMemoryEnrollmentsRepository
    )
  })

  it('should be able to evaluate a class', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    const classToEvaluate = makeClass({ name: 'John Doe Class', moduleId: module.id, classNumber: 1 })
    await inMemoryClassesRepository.create(classToEvaluate)

    const student = makeStudent()
    await inMemoryStudentsRepository.create(student)

    const enrollment = makeEnrollment({ courseId: course.id, studentId: student.id })
    await inMemoryEnrollmentsRepository.create(enrollment)

    const result = await sut.exec({
      value: 3,
      studentId: student.id.toString(),
      courseId: course.id.toString(),
      classId: classToEvaluate.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      evaluation: expect.objectContaining({
        value: 3,
        studentId: student.id,
        classId: classToEvaluate.id
      })
    })
  })

  it('should not be able to evaluate a class with an invalid value', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    const classToEvaluate = makeClass({ name: 'John Doe Class', moduleId: module.id, classNumber: 1 })
    await inMemoryClassesRepository.create(classToEvaluate)

    const student = makeStudent()
    await inMemoryStudentsRepository.create(student)

    const enrollment = makeEnrollment({ courseId: course.id, studentId: student.id })
    await inMemoryEnrollmentsRepository.create(enrollment)

    const result = await sut.exec({
      value: 7, // The rating must be from 1 to 5
      studentId: student.id.toString(),
      courseId: course.id.toString(),
      classId: classToEvaluate.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidEvaluationValueError)
  })

  it('should not be able to evaluate a inexistent class', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    const student = makeStudent()
    await inMemoryStudentsRepository.create(student)

    const enrollment = makeEnrollment({ courseId: course.id, studentId: student.id })
    await inMemoryEnrollmentsRepository.create(enrollment)

    const result = await sut.exec({
      value: 3,
      studentId: student.id.toString(),
      courseId: course.id.toString(),
      classId: 'inexistentClassId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('an inexistent student should not be able to evaluate a class', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    const classToEvaluate = makeClass({ name: 'John Doe Class', moduleId: module.id, classNumber: 1 })
    await inMemoryClassesRepository.create(classToEvaluate)

    const result = await sut.exec({
      value: 3,
      studentId: 'inexistentStudentId',
      courseId: course.id.toString(),
      classId: classToEvaluate.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('an student should not be able to evaluate a same class twice', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    const classToEvaluate = makeClass({ name: 'John Doe Class', moduleId: module.id, classNumber: 1 })
    await inMemoryClassesRepository.create(classToEvaluate)

    const student = makeStudent()
    await inMemoryStudentsRepository.create(student)

    const enrollment = makeEnrollment({ courseId: course.id, studentId: student.id })
    await inMemoryEnrollmentsRepository.create(enrollment)

    await sut.exec({
      value: 3,
      studentId: student.id.toString(),
      courseId: course.id.toString(),
      classId: classToEvaluate.id.toString()
    })

    const result = await sut.exec({
      value: 3,
      studentId: student.id.toString(),
      courseId: course.id.toString(),
      classId: classToEvaluate.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(StudentAlreadyEvaluateThisClassError)
  })

  it('should not be able to evaluate a class if the student is not enrolled in the respective course', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    const classToEvaluate = makeClass({ name: 'John Doe Class', moduleId: module.id, classNumber: 1 })
    await inMemoryClassesRepository.create(classToEvaluate)

    const student = makeStudent()
    await inMemoryStudentsRepository.create(student)

    // Not enrolled in the course

    const result = await sut.exec({
      value: 3,
      studentId: student.id.toString(),
      courseId: course.id.toString(),
      classId: classToEvaluate.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(StudentMustBeRegisteredToEvaluateError)
  })
})
