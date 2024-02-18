import { DeleteCourseCertificateUseCase } from '@/domain/course-management/application/use-cases/delete-course-certificate'
import { makePrismaCertificatesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-certificates-repository'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { makePrismaInstructorsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-instructors-repository'

export function makeDeleteCourseCertificateUseCase() {
  const prismaCertificatesRepository = makePrismaCertificatesRepository()
  const prismaCoursesRepository = makePrismaCoursesRepository()
  const prismaInstructorsRepository = makePrismaInstructorsRepository()

  const deleteCourseCertificateUseCase = new DeleteCourseCertificateUseCase(
    prismaCertificatesRepository,
    prismaCoursesRepository,
    prismaInstructorsRepository
  )

  return deleteCourseCertificateUseCase
}
