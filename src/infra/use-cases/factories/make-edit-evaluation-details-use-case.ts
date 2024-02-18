import { EditEvaluationDetailsUseCase } from '@/domain/course-management/application/use-cases/edit-evaluation-details'
import { makePrismaStudentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-students-repository'
import { PrismaEvaluationsRepository } from '@/infra/database/prisma/repositories/prisma-evaluations-repository'

export function makeEditEvaluationDetailsUseCase() {
  const prismaEvaluationsRepository = new PrismaEvaluationsRepository()
  const prismaStudentsRepository = makePrismaStudentsRepository()

  const editEvaluationDetailsUseCase = new EditEvaluationDetailsUseCase(
    prismaEvaluationsRepository,
    prismaStudentsRepository
  )

  return editEvaluationDetailsUseCase
}
