import { makeEnrollmentMapper } from '../../mappers/factories/make-enrollment-mapper'
import { PrismaEnrollmentsRepository } from './../prisma-enrollments-repository'

export function makePrismaEnrollmentsRepository() {
  const enrollmentMapper = makeEnrollmentMapper()
  const prismaEnrollmentsRepository = new PrismaEnrollmentsRepository(enrollmentMapper)

  return prismaEnrollmentsRepository
}
