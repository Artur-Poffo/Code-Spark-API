import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type EnrollmentCompletedItem } from '../../enterprise/entities/enrollment-completed-item'
import { type EnrollmentCompletedItemsRepository } from '../repositories/enrollment-completed-items-repository'
import { type EnrollmentsRepository } from '../repositories/enrollments-repository'

interface FetchEnrollmentCompletedModulesUseCaseRequest {
  enrollmentId: string
}

type FetchEnrollmentCompletedModulesUseCaseResponse = Either<
ResourceNotFoundError,
{
  completedModules: EnrollmentCompletedItem[]
}
>

export class FetchEnrollmentCompletedModulesUseCase implements UseCase<FetchEnrollmentCompletedModulesUseCaseRequest, FetchEnrollmentCompletedModulesUseCaseResponse> {
  constructor(
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly enrollmentCompletedItemsRepository: EnrollmentCompletedItemsRepository
  ) { }

  async exec({
    enrollmentId
  }: FetchEnrollmentCompletedModulesUseCaseRequest): Promise<FetchEnrollmentCompletedModulesUseCaseResponse> {
    const enrollment = await this.enrollmentsRepository.findById(enrollmentId)

    if (!enrollment) {
      return left(new ResourceNotFoundError())
    }

    const enrollmentCompletedModules = await this.enrollmentCompletedItemsRepository.findManyCompletedModulesByEnrollmentId(
      enrollmentId
    )

    return right({
      completedModules: enrollmentCompletedModules
    })
  }
}
