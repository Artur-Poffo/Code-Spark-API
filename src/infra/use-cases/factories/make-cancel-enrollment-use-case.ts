import { CancelEnrollmentUseCase } from '@/domain/course-management/application/use-cases/cancel-enrollment'
import { makePrismaEnrollmentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-enrollments-repository'
import { makePrismaStudentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-students-repository'

export function makeCancelEnrollmentUseCase() {
  const prismaEnrollmentsRepository = makePrismaEnrollmentsRepository()
  const prismaStudentsRepository = makePrismaStudentsRepository()

  const cancelEnrollmentUseCase = new CancelEnrollmentUseCase(
    prismaEnrollmentsRepository,
    prismaStudentsRepository
  )

  return cancelEnrollmentUseCase
}
