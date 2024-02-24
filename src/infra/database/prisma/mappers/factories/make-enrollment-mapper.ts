import { EnrollmentMapper } from '../enrollment-mapper'
import { PrismaEnrollmentCompleteItemsRepository } from './../../repositories/prisma-enrollment-completed-items-repository'

export function makeEnrollmentMapper() {
  const prismaEnrollmentCompleteItemsRepository = new PrismaEnrollmentCompleteItemsRepository()

  const enrollmentMapper = new EnrollmentMapper(
    prismaEnrollmentCompleteItemsRepository
  )

  return enrollmentMapper
}
