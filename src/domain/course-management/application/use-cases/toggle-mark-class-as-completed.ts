import { left, right, type Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Class } from '../../enterprise/entities/class'
import { EnrollmentCompletedItem } from '../../enterprise/entities/enrollment-completed-item'
import { type CoursesRepository } from '../repositories/courses-repository'
import { type EnrollmentCompletedItemsRepository } from '../repositories/enrollment-completed-items-repository'
import { type EnrollmentsRepository } from '../repositories/enrollments-repository'
import { type StudentsRepository } from '../repositories/students-repository'
import { type ClassesRepository } from './../repositories/classes-repository'
import { type ModulesRepository } from './../repositories/modules-repository'

interface ToggleMarkClassAsCompletedUseCaseRequest {
  enrollmentId: string
  studentId: string
  classId: string
}

type ToggleMarkClassAsCompletedUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError,
{
  class: Class
}
>

export class ToggleMarkClassAsCompletedUseCase implements UseCase<ToggleMarkClassAsCompletedUseCaseRequest, ToggleMarkClassAsCompletedUseCaseResponse> {
  constructor(
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly coursesRepository: CoursesRepository,
    private readonly modulesRepository: ModulesRepository,
    private readonly classesRepository: ClassesRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly enrollmentCompletedItemsRepository: EnrollmentCompletedItemsRepository
  ) { }

  async exec({
    enrollmentId,
    studentId,
    classId
  }: ToggleMarkClassAsCompletedUseCaseRequest): Promise<ToggleMarkClassAsCompletedUseCaseResponse> {
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

    const classAlreadyMarkedAsCompleted = await this.enrollmentCompletedItemsRepository.findByEnrollmentIdAndItemId(
      enrollmentId,
      classId
    )

    if (classAlreadyMarkedAsCompleted) {
      await this.enrollmentCompletedItemsRepository.delete(classAlreadyMarkedAsCompleted)

      return right({
        class: classToMarkAsCompleted
      })
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

    const completedItem = EnrollmentCompletedItem.create({
      enrollmentId: enrollment.id,
      itemId: classToMarkAsCompleted.id,
      type: 'CLASS'
    })
    await this.enrollmentCompletedItemsRepository.create(completedItem)

    return right({
      class: classToMarkAsCompleted
    })
  }
}
