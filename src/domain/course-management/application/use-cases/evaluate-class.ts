import { left, right, type Either } from '@/core/either'
import { type NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { Evaluation } from '../../enterprise/entities/evaluation'
import { type CoursesRepository } from '../repositories/courses-repository'
import { type EnrollmentsRepository } from '../repositories/enrollments-repository'
import { type EvaluationsRepository } from '../repositories/evaluations-repository'
import { type StudentsRepository } from '../repositories/students-repository'
import { type ClassesRepository } from './../repositories/classes-repository'
import { InvalidEvaluationValueError } from './errors/invalid-evaluation-value-error'
import { StudentAlreadyEvaluateThisClassError } from './errors/student-already-evaluate-this-class-error'
import { StudentMustBeRegisteredToEvaluateError } from './errors/student-must-be-registered-to-evaluate-error'

interface EvaluateClassUseCaseRequest {
  value: number
  studentId: string
  courseId: string
  classId: string
}

type EvaluateClassUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError,
{
  evaluation: Evaluation
}
>

export class EvaluateClassUseCase implements UseCase< EvaluateClassUseCaseRequest, EvaluateClassUseCaseResponse> {
  constructor(
    private readonly evaluationsRepository: EvaluationsRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly coursesRepository: CoursesRepository,
    private readonly classesRepository: ClassesRepository,
    private readonly enrollmentsRepository: EnrollmentsRepository
  ) { }

  async exec({
    value,
    studentId,
    courseId,
    classId
  }: EvaluateClassUseCaseRequest): Promise<EvaluateClassUseCaseResponse> {
    const invalidValue = value < 1 || value > 5

    if (invalidValue) {
      return left(new InvalidEvaluationValueError())
    }

    const [student, course, classToEvaluate] = await Promise.all([
      this.studentsRepository.findById(studentId),
      this.coursesRepository.findById(courseId),
      this.classesRepository.findById(classId)
    ])

    if (!student || !course || !classToEvaluate) {
      return left(new ResourceNotFoundError())
    }

    const studentAlreadyEvaluateThisClass = await this.evaluationsRepository.findByStudentIdAndClassId(studentId, classId)

    if (studentAlreadyEvaluateThisClass) {
      return left(new StudentAlreadyEvaluateThisClassError(classToEvaluate.name))
    }

    const studentIsEnrolledInTheCourse = await this.enrollmentsRepository.findByStudentIdAndCourseId(studentId, courseId)

    if (!studentIsEnrolledInTheCourse) {
      return left(new StudentMustBeRegisteredToEvaluateError(course.name))
    }

    const evaluation = Evaluation.create({
      value,
      studentId: student.id,
      classId: classToEvaluate.id
    })

    await this.evaluationsRepository.create(evaluation)

    return right({
      evaluation
    })
  }
}
