import { left, right, type Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Evaluation } from '../../enterprise/entities/evaluation'
import { type EvaluationsRepository } from '../repositories/evaluations-repository'
import { type StudentsRepository } from '../repositories/students-repository'
import { InvalidEvaluationValueError } from './errors/invalid-evaluation-value-error'

interface EditEvaluationDetailsUseCaseRequest {
  value?: number
  evaluationId: string
  studentId: string
}

type EditEvaluationDetailsUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError,
{
  evaluation: Evaluation
}
>

export class EditEvaluationDetailsUseCase implements UseCase<EditEvaluationDetailsUseCaseRequest, EditEvaluationDetailsUseCaseResponse> {
  constructor(
    private readonly evaluationsRepository: EvaluationsRepository,
    private readonly studentsRepository: StudentsRepository
  ) { }

  async exec({
    value,
    evaluationId,
    studentId
  }: EditEvaluationDetailsUseCaseRequest): Promise<EditEvaluationDetailsUseCaseResponse> {
    const [evaluation, student] = await Promise.all([
      this.evaluationsRepository.findById(evaluationId),
      this.studentsRepository.findById(studentId)
    ])

    if (!evaluation || !student) {
      return left(new ResourceNotFoundError())
    }

    const studentIsTheEvaluationOwner = evaluation.studentId.equals(student.id)

    if (!studentIsTheEvaluationOwner) {
      return left(new NotAllowedError())
    }

    let newValue: number | null = null

    if (value) {
      if (value < 1 || value > 5) {
        return left(new InvalidEvaluationValueError())
      }

      newValue = value
    }

    evaluation.value = newValue ?? evaluation.value

    await this.evaluationsRepository.save(evaluation)

    return right({
      evaluation
    })
  }
}
