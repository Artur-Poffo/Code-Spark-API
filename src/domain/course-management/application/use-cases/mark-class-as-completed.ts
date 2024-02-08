import { left, right, type Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Class } from '../../enterprise/entities/class'
import { type CoursesRepository } from '../repositories/courses-repository'
import { type EnrollmentsRepository } from '../repositories/enrollments-repository'
import { type StudentsRepository } from '../repositories/students-repository'
import { type ClassesRepository } from './../repositories/classes-repository'
import { type ModulesRepository } from './../repositories/modules-repository'

interface MarkClassAsCompletedUseCaseRequest {
  enrollmentId: string
  studentId: string
  classId: string
}

type MarkClassAsCompletedUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError,
{
  class: Class
}
>

export class MarkClassAsCompletedUseCase implements UseCase<MarkClassAsCompletedUseCaseRequest, MarkClassAsCompletedUseCaseResponse> {
  constructor(
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly coursesRepository: CoursesRepository,
    private readonly modulesRepository: ModulesRepository,
    private readonly classesRepository: ClassesRepository,
    private readonly studentsRepository: StudentsRepository
  ) { }

  async exec({
    enrollmentId,
    studentId,
    classId
  }: MarkClassAsCompletedUseCaseRequest): Promise<MarkClassAsCompletedUseCaseResponse> {
    const [enrollment, student, classToMarkAsCompleted] = await Promise.all([
      this.enrollmentsRepository.findById(enrollmentId),
      this.studentsRepository.findById(studentId),
      this.classesRepository.findById(classId)
    ])

    if (!enrollment || !student || !classToMarkAsCompleted) {
      return left(new ResourceNotFoundError())
    }

    const studentIsTheEnrollmentOwner = enrollment.studentId.toString() === studentId

    if (!studentIsTheEnrollmentOwner) {
      return left(new NotAllowedError())
    }

    const completeCourse = await this.coursesRepository.findCompleteCourseEntityById(enrollment.courseId.toString())

    if (!completeCourse) {
      return left(new ResourceNotFoundError())
    }

    const courseClasses = await this.modulesRepository.findManyClassesByCourseId(completeCourse.course.id.toString())
    const courseClassesIds = courseClasses.map(classToMap => classToMap.id.toString())

    const classExistInThisCourse = courseClassesIds.includes(classId)

    if (!classExistInThisCourse) {
      return left(new ResourceNotFoundError())
    }

    enrollment.completedClasses.push(classToMarkAsCompleted.id)
    await this.enrollmentsRepository.save(enrollment)

    return right({
      class: classToMarkAsCompleted
    })
  }
}
