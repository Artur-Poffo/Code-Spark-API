import { right, type Either } from '@/core/either'
import { type NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { type ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type EvaluationsRepository } from '../repositories/evaluations-repository'

interface GetCourseEvaluationsAverageUseCaseRequest {
  courseId: string
}

type GetCourseEvaluationsAverageUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError,
{
  evaluationsAverage: number
}
>

export class GetCourseEvaluationsAverageUseCase implements UseCase< GetCourseEvaluationsAverageUseCaseRequest, GetCourseEvaluationsAverageUseCaseResponse> {
  constructor(
    private readonly evaluationsRepository: EvaluationsRepository
  ) { }

  async exec({
    courseId
  }: GetCourseEvaluationsAverageUseCaseRequest): Promise<GetCourseEvaluationsAverageUseCaseResponse> {
    const courseEvaluations = await this.evaluationsRepository.findManyByCourseId(courseId)

    let sumOfCourseEvaluations = 0

    courseEvaluations.forEach(courseEvaluation => {
      sumOfCourseEvaluations += courseEvaluation.value
    })

    const courseEvaluationsAverage = sumOfCourseEvaluations / courseEvaluations.length

    return right({
      evaluationsAverage: courseEvaluationsAverage
    })
  }
}
