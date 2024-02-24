import { left, right, type Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type CompleteCourseDTO } from '../../enterprise/entities/dtos/complete-course'
import { type Module } from '../../enterprise/entities/module'
import { type CoursesRepository } from '../repositories/courses-repository'
import { type EnrollmentCompletedItemsRepository } from '../repositories/enrollment-completed-items-repository'
import { type EnrollmentsRepository } from '../repositories/enrollments-repository'
import { type StudentsRepository } from '../repositories/students-repository'
import { type ModulesRepository } from './../repositories/modules-repository'
import { AllModulesInTheCourseMustBeMarkedAsCompleted } from './errors/all-modules-in-the-course-must-be-marked-as-completed'
import { ItemAlreadyCompletedError } from './errors/item-already-completed-error'

interface MarkCourseAsCompletedUseCaseRequest {
  enrollmentId: string
  studentId: string
}

type MarkCourseAsCompletedUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError | AllModulesInTheCourseMustBeMarkedAsCompleted | ItemAlreadyCompletedError,
{
  course: CompleteCourseDTO
}
>

export class MarkCourseAsCompletedUseCase implements UseCase<MarkCourseAsCompletedUseCaseRequest, MarkCourseAsCompletedUseCaseResponse> {
  constructor(
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly coursesRepository: CoursesRepository,
    private readonly modulesRepository: ModulesRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly enrollmentCompletedItemsRepository: EnrollmentCompletedItemsRepository
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

    const courseAlreadyMarkedAsCompleted = enrollment.completedAt

    if (courseAlreadyMarkedAsCompleted) {
      return left(new ItemAlreadyCompletedError())
    }

    const completeCourse = await this.coursesRepository.findCompleteCourseEntityById(enrollment.courseId.toString())

    if (!completeCourse) {
      return left(new ResourceNotFoundError())
    }

    const courseModules = await this.modulesRepository.findManyByCourseId(completeCourse.course.id.toString())
    const completedModulesItems = await this.enrollmentCompletedItemsRepository.findManyCompletedModulesByEnrollmentId(enrollmentId)

    const completedModules: Module[] = []

    await Promise.all(
      completedModulesItems.map(async completedItem => {
        if (completedItem.type === 'MODULE') {
          const module = await this.modulesRepository.findById(completedItem.itemId.toString())

          if (module) {
            completedModules.push(module)
          }
        }
      })
    )

    const allModulesOfThisCourseIsCompleted = courseModules.every(moduleToCompare => {
      return completedModules.some(completedModule => completedModule.id.toString() === moduleToCompare.id.toString())
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
