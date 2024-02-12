import { left, right, type Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type CompleteCourseDTO } from '../../enterprise/entities/dtos/complete-course'
import { type CoursesRepository } from '../repositories/courses-repository'
import { type EnrollmentsRepository } from '../repositories/enrollments-repository'
import { type StudentsRepository } from '../repositories/students-repository'
import { type ModulesRepository } from './../repositories/modules-repository'
import { AllModulesInTheCourseMustBeMarkedAsCompleted } from './errors/all-modules-in-the-course-must-be-marked-as-completed'

interface MarkCourseAsCompletedUseCaseRequest {
  enrollmentId: string
  studentId: string
}

type MarkCourseAsCompletedUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError | AllModulesInTheCourseMustBeMarkedAsCompleted,
{
  course: CompleteCourseDTO
}
>

export class MarkCourseAsCompletedUseCase implements UseCase<MarkCourseAsCompletedUseCaseRequest, MarkCourseAsCompletedUseCaseResponse> {
  constructor(
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly coursesRepository: CoursesRepository,
    private readonly modulesRepository: ModulesRepository,
    private readonly studentsRepository: StudentsRepository
  ) { }

  async exec({
    enrollmentId,
    studentId
  }: MarkCourseAsCompletedUseCaseRequest): Promise<MarkCourseAsCompletedUseCaseResponse> {
    const [enrollment, student] = await Promise.all([
      this.enrollmentsRepository.findById(enrollmentId),
      this.studentsRepository.findById(studentId)
    ])

    if (!enrollment || !student) {
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

    const courseModules = await this.modulesRepository.findManyByCourseId(completeCourse.course.id.toString())

    const allModulesOfThisCourseIsCompleted = courseModules.every(moduleToCompare => {
      return enrollment.completedModules.includes(moduleToCompare.id)
    })

    if (!allModulesOfThisCourseIsCompleted) {
      return left(new AllModulesInTheCourseMustBeMarkedAsCompleted(completeCourse.course.name))
    }

    await this.enrollmentsRepository.markAsCompleted(enrollment)

    return right({
      course: completeCourse
    })
  }
}
