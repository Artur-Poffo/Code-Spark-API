import { FetchEnrollmentCompletedModulesUseCase } from '@/domain/course-management/application/use-cases/fetch-enrollment-completed-modules'
import { makePrismaEnrollmentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-enrollments-repository'
import { PrismaEnrollmentCompleteItemsRepository } from '@/infra/database/prisma/repositories/prisma-enrollment-completed-items-repository'

export function makeFetchEnrollmentCompletedModulesUseCase() {
  const prismaEnrollmentsRepository = makePrismaEnrollmentsRepository()
  const prismaEnrollmentCompletedItemsRepository = new PrismaEnrollmentCompleteItemsRepository()

  const fetchEnrollmentCompletedModulesUseCase = new FetchEnrollmentCompletedModulesUseCase(
    prismaEnrollmentsRepository,
    prismaEnrollmentCompletedItemsRepository
  )

  return fetchEnrollmentCompletedModulesUseCase
}
