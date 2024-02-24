import { type Prisma } from '@prisma/client'

export class EvaluationPresenter {
  static toHTTP(evaluation: Prisma.EvaluationUncheckedCreateInput) {
    return {
      id: evaluation.id,
      value: evaluation.value,
      createdAt: evaluation.createdAt,
      studentId: evaluation.studentId,
      classId: evaluation.classId
    }
  }
}
