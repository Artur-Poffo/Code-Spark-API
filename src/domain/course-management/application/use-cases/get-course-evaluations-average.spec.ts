import { makeClass } from '../../../../../test/factories/make-class'
import { makeCourse } from '../../../../../test/factories/make-course'
import { makeEvaluation } from '../../../../../test/factories/make-evaluations'
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
import { GetCourseEvaluationsAverageUseCase } from './get-course-evaluations-average'

let inMemoryEnrollmentsRepository: InMemoryEnrollmentsRepository
let inMemoryCourseTagsRepository: InMemoryCourseTagsRepository
let inMemoryClassesRepository: InMemoryClassesRepository
let inMemoryInstructorsRepository: InMemoryInstructorRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryModulesRepository: InMemoryModulesRepository
let inMemoryEvaluationsRepository: InMemoryEvaluationsRepository
let inMemoryCoursesRepository: InMemoryCoursesRepository
let sut: GetCourseEvaluationsAverageUseCase

describe('Get course evaluations average use case', () => {
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

    sut = new GetCourseEvaluationsAverageUseCase(
      inMemoryEvaluationsRepository
    )
  })

  it('should be able to average the evaluations of a course', async () => {
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

    const firstEvaluation = makeEvaluation({ value: 4, classId: classToEvaluate.id, studentId: student.id })
    const secondEvaluation = makeEvaluation({ value: 2, classId: classToEvaluate.id, studentId: student.id })

    await Promise.all([
      inMemoryEvaluationsRepository.create(firstEvaluation),
      inMemoryEvaluationsRepository.create(secondEvaluation)
    ])

    const result = await sut.exec({
      courseId: course.id.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      evaluationsAverage: 3 //  (4 + 2) / 2 = 3
    })
  })
})
