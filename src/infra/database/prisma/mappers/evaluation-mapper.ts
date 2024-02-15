import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Evaluation } from '@/domain/course-management/enterprise/entities/evaluation'
import { type Prisma, type Evaluation as PrismaEvaluation } from '@prisma/client'

export class EvaluationMapper {
  static toDomain(raw: PrismaEvaluation): Evaluation {
    return Evaluation.create(
      {
        classId: new UniqueEntityID(raw.classId),
        studentId: new UniqueEntityID(raw.userId),
        value: raw.value,
        createdAt: raw.createdAt
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(evaluation: Evaluation): Prisma.EvaluationUncheckedCreateInput {
    return {
      id: evaluation.id.toString(),
      classId: evaluation.classId.toString(),
      userId: evaluation.studentId.toString(),
      value: evaluation.value,
      createdAt: evaluation.createdAt
    }
  }
}
