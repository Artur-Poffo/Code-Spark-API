import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
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
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { InMemoryInstructorRepository } from './../../../../../test/repositories/in-memory-instructors-repository'
import { InMemoryModulesRepository } from './../../../../../test/repositories/in-memory-modules-repository'
import { GetCourseMetricsUseCase } from './get-course-metrics'

let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: GetCourseMetricsUseCase

describe('Get course metrics use case', () => {
  beforeEach(() => {
    inMemoryClassesRepository = new InMemoryClassesRepository()
    inMemoryInstructorsRepository = new InMemoryInstructorRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryModulesRepository = new InMemoryModulesRepository(inMemoryClassesRepository)

    inMemoryEnrollmentsRepository = new InMemoryEnrollmentsRepository(
      inMemoryClassesRepository, inMemoryModulesRepository, inMemoryStudentsRepository
    )
    inMemoryCoursesRepository = new InMemoryCoursesRepository(inMemoryModulesRepository, inMemoryInstructorsRepository, inMemoryEnrollmentsRepository, inMemoryStudentsRepository, inMemoryCourseTagsRepository)

    sut = new GetCourseMetricsUseCase(
      inMemoryCoursesRepository,
      inMemoryEnrollmentsRepository,
      inMemoryInstructorsRepository
    )
  })

  it('should be able to get metrics of a course', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id, createdAt: new Date('2007-03-27') })
    await inMemoryCoursesRepository.create(course)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    const classToAdd = makeClass({ name: 'John Doe Class', moduleId: module.id, classNumber: 1 })
    await inMemoryClassesRepository.create(classToAdd)

    const student = makeStudent({ age: 20 })
    await inMemoryStudentsRepository.create(student)

    const enrollment = makeEnrollment({ courseId: course.id, studentId: student.id })
    await inMemoryEnrollmentsRepository.create(enrollment)

    await inMemoryEnrollmentsRepository.markAsCompleted(enrollment)

    const result = await sut.exec({
      courseId: course.id.toString(),
      instructorId: instructor.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      enrolledStudentsNumber: 1,
      ageAverage: 20,
      growthPercentage: 0,
      growthPercentageFromLastYear: 0,
      completionPercentage: 100
    })
  })

  it('should not be able to get metrics of a inexistent course', async () => {
    const result = await sut.exec({
      courseId: 'inexistentCourseId',
      instructorId: 'inexistentInstructorId'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to get metrics of a course if the instructor not is the owner', async () => {
    const wrongInstructor = makeInstructor()
    const correctInstructor = makeInstructor()

    await Promise.all([
      inMemoryInstructorsRepository.create(correctInstructor),
      inMemoryInstructorsRepository.create(wrongInstructor)
    ])

    const course = makeCourse({ instructorId: correctInstructor.id, createdAt: new Date('2007-03-27') })
    await inMemoryCoursesRepository.create(course)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    const classToAdd = makeClass({ name: 'John Doe Class', moduleId: module.id, classNumber: 1 })
    await inMemoryClassesRepository.create(classToAdd)

    const student = makeStudent({ age: 20 })
    await inMemoryStudentsRepository.create(student)

    const enrollment = makeEnrollment({ courseId: course.id, studentId: student.id })
    await inMemoryEnrollmentsRepository.create(enrollment)

    await inMemoryEnrollmentsRepository.markAsCompleted(enrollment)

    const result = await sut.exec({
      courseId: course.id.toString(),
      instructorId: wrongInstructor.id.toString()
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should be able to get correct course metrics', async () => {
    const instructor = makeInstructor()
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ instructorId: instructor.id, createdAt: new Date('2007-03-27') })
    await inMemoryCoursesRepository.create(course)

    const module = makeModule({
      courseId: course.id,
      moduleNumber: 1
    })
    await inMemoryModulesRepository.create(module)

    const classToAdd = makeClass({ name: 'John Doe Class', moduleId: module.id, classNumber: 1 })
    await inMemoryClassesRepository.create(classToAdd)

    const firstStudent = makeStudent({ age: 46 })
    const secondStudent = makeStudent({ age: 34 })

    await Promise.all([
      inMemoryStudentsRepository.create(firstStudent),
      inMemoryStudentsRepository.create(secondStudent)
    ])

    const firstEnrollment = makeEnrollment({ courseId: course.id, studentId: firstStudent.id, ocurredAt: new Date('2008-03-27') })
    const secondEnrollment = makeEnrollment({ courseId: course.id, studentId: secondStudent.id })

    await Promise.all([
      inMemoryEnrollmentsRepository.create(firstEnrollment),
      inMemoryEnrollmentsRepository.create(secondEnrollment)
    ])

    await inMemoryEnrollmentsRepository.markAsCompleted(firstEnrollment)

    const result = await sut.exec({
      courseId: course.id.toString(),
      instructorId: instructor.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      enrolledStudentsNumber: 2,
      ageAverage: 40,
      growthPercentage: 0,
      growthPercentageFromLastYear: 0,
      completionPercentage: 50
    })
  })

  it('should calculate course growth percentage correctly', async ({ expect }) => {
    const createdAt = new Date('2007-03-27')

    const instructor = makeInstructor({ registeredAt: createdAt })
    await inMemoryInstructorsRepository.create(instructor)

    const course = makeCourse({ createdAt, instructorId: instructor.id })
    await inMemoryCoursesRepository.create(course)

    const currentYear = 2024

    const enrollmentsOnReferenceYear = 100
    const enrollmentsOnLastYear = 80

    const countEnrollmentsByYear = async (year: number): Promise<number> => {
      console.log(`called with year: ${year}`)

      if (year === currentYear) {
        return 120
      } else if (year === createdAt.getFullYear()) {
        return enrollmentsOnReferenceYear
      } else if (year === currentYear - 1) {
        return enrollmentsOnLastYear
      }

      return 0
    }

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalMethod = inMemoryEnrollmentsRepository.countEnrollmentsByYear
    inMemoryEnrollmentsRepository.countEnrollmentsByYear = countEnrollmentsByYear

    // eslint-disable-next-line @typescript-eslint/unbound-method
    console.log(inMemoryEnrollmentsRepository.countEnrollmentsByYear)

    const result = await sut.exec({
      courseId: course.id.toString(),
      instructorId: course.instructorId.toString()
    })

    console.log(result)

    inMemoryEnrollmentsRepository.countEnrollmentsByYear = originalMethod

    expect(result.isRight()).toBe(true)

    const expectedGrowthPercentage = ((120 - enrollmentsOnReferenceYear) / enrollmentsOnReferenceYear) * 100
    const expectedGrowthPercentageFromLastYear = ((120 - enrollmentsOnLastYear) / enrollmentsOnLastYear) * 100

    console.log(enrollmentsOnReferenceYear)
    console.log(enrollmentsOnLastYear)
    console.log(currentYear)

    expect(result.value).toMatchObject({
      growthPercentage: expectedGrowthPercentage,
      growthPercentageFromLastYear: expectedGrowthPercentageFromLastYear
    })
  })
})
