import { EvaluateClassUseCase } from '@/domain/course-management/application/use-cases/evaluate-class'
import { makePrismaClassesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-classes-repository'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { makePrismaEnrollmentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-enrollments-repository'
import { makePrismaStudentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-students-repository'
import { PrismaEvaluationsRepository } from '@/infra/database/prisma/repositories/prisma-evaluations-repository'

export function makeEvaluateClassUseCase() {
  const prismaEvaluationsRepository = new PrismaEvaluationsRepository()
  const prismaStudentsRepository = makePrismaStudentsRepository()
  const prismaCoursesRepository = makePrismaCoursesRepository()
  const prismaClassesRepository = makePrismaClassesRepository()
  const prismaEnrollmentsRepository = makePrismaEnrollmentsRepository()

  const evaluateClassUseCase = new EvaluateClassUseCase(
    prismaEvaluationsRepository,
    prismaStudentsRepository,
    prismaCoursesRepository,
    prismaClassesRepository,
    prismaEnrollmentsRepository
  )

  return evaluateClassUseCase
}
