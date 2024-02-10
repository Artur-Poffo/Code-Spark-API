import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Evaluation, type EvaluationProps } from '@/domain/course-management/enterprise/entities/evaluation'

export function makeEvaluation(
  override: Partial<EvaluationProps> = {},
  id?: UniqueEntityID
) {
  const evaluation = Evaluation.create(
    {
      value: override.value ?? 5,
      classId: override.classId ?? new UniqueEntityID(),
      studentId: override.studentId ?? new UniqueEntityID(),
      ...override
    },
    id
  )

  return evaluation
}
