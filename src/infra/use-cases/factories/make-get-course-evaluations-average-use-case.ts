import { GetCourseEvaluationsAverageUseCase } from '@/domain/course-management/application/use-cases/get-course-evaluations-average'
import { PrismaEvaluationsRepository } from './../../database/prisma/repositories/prisma-evaluations-repository'

export function makeGetCourseEvaluationsAverageUseCase() {
  const prismaEvaluationsRepository = new PrismaEvaluationsRepository()

  const getCourseEvaluationsAverageUseCase = new GetCourseEvaluationsAverageUseCase(
    prismaEvaluationsRepository
  )

  return getCourseEvaluationsAverageUseCase
}
