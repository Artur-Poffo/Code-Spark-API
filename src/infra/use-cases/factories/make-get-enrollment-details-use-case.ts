import { GetEnrollmentDetailsUseCase } from '@/domain/course-management/application/use-cases/get-enrollment-details'
import { makePrismaEnrollmentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-enrollments-repository'

export function makeGetEnrollmentDetailsUseCase() {
  const prismaEnrollmentsRepository = makePrismaEnrollmentsRepository()

  const getEnrollmentDetailsUseCase = new GetEnrollmentDetailsUseCase(
    prismaEnrollmentsRepository
  )

  return getEnrollmentDetailsUseCase
}
