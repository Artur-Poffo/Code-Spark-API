import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type EnrollmentCompletedItem } from '../../enterprise/entities/enrollment-completed-item'
import { type EnrollmentCompletedItemsRepository } from '../repositories/enrollment-completed-items-repository'
import { type EnrollmentsRepository } from '../repositories/enrollments-repository'

interface FetchEnrollmentCompletedClassesUseCaseRequest {
  enrollmentId: string
}

type FetchEnrollmentCompletedClassesUseCaseResponse = Either<
ResourceNotFoundError,
{
  completedClasses: EnrollmentCompletedItem[]
}
>

export class FetchEnrollmentCompletedClassesUseCase implements UseCase<FetchEnrollmentCompletedClassesUseCaseRequest, FetchEnrollmentCompletedClassesUseCaseResponse> {
  constructor(
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly enrollmentCompletedItemsRepository: EnrollmentCompletedItemsRepository
  ) { }

  async exec({
    enrollmentId
  }: FetchEnrollmentCompletedClassesUseCaseRequest): Promise<FetchEnrollmentCompletedClassesUseCaseResponse> {
    const enrollment = await this.enrollmentsRepository.findById(enrollmentId)

    if (!enrollment) {
      return left(new ResourceNotFoundError())
    }

    const enrollmentCompletedClasses = await this.enrollmentCompletedItemsRepository.findManyCompletedClassesByEnrollmentId(
      enrollmentId
    )

    return right({
      completedClasses: enrollmentCompletedClasses
    })
  }
}
