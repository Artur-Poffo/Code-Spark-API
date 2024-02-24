import { FetchEnrollmentCompletedClassesUseCase } from '@/domain/course-management/application/use-cases/fetch-enrollment-completed-classes'
import { makePrismaEnrollmentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-enrollments-repository'
import { PrismaEnrollmentCompleteItemsRepository } from '@/infra/database/prisma/repositories/prisma-enrollment-completed-items-repository'

export function makeFetchEnrollmentCompletedClassesUseCase() {
  const prismaEnrollmentsRepository = makePrismaEnrollmentsRepository()
  const prismaEnrollmentCompletedItemsRepository = new PrismaEnrollmentCompleteItemsRepository()

  const fetchEnrollmentCompletedClassesUseCase = new FetchEnrollmentCompletedClassesUseCase(
    prismaEnrollmentsRepository,
    prismaEnrollmentCompletedItemsRepository
  )

  return fetchEnrollmentCompletedClassesUseCase
}
