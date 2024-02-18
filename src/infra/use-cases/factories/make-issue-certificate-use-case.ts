import { IssueCertificateUseCase } from '@/domain/course-management/application/use-cases/issue-certificate'
import { makePrismaCertificatesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-certificates-repository'
import { makePrismaEnrollmentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-enrollments-repository'
import { makePrismaStudentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-students-repository'
import { PrismaStudentCertificatesRepository } from '@/infra/database/prisma/repositories/prisma-student-certificates-repository'

export function makeIssueCertificateUseCase() {
  const prismaCertificatesRepository = makePrismaCertificatesRepository()
  const prismaStudentCertificatesRepository = new PrismaStudentCertificatesRepository()
  const prismaEnrollmentsRepository = makePrismaEnrollmentsRepository()
  const prismaStudentsRepository = makePrismaStudentsRepository()

  const issueCertificateUseCase = new IssueCertificateUseCase(
    prismaCertificatesRepository,
    prismaStudentCertificatesRepository,
    prismaEnrollmentsRepository,
    prismaStudentsRepository
  )

  return issueCertificateUseCase
}
