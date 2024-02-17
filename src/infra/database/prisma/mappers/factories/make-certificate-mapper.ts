import { InMemoryImagesRepository } from '../../../../../../test/repositories/in-memory-images-repository'
import { PrismaStudentCertificatesRepository } from '../../repositories/prisma-student-certificates-repository'
import { CertificateMapper } from '../certificate-mapper'

export function makeCertificateMapper() {
  const inMemoryImagesRepository = new InMemoryImagesRepository()
  const prismaStudentCertificatesRepository = new PrismaStudentCertificatesRepository()

  const certificateMapper = new CertificateMapper(
    inMemoryImagesRepository,
    prismaStudentCertificatesRepository
  )

  return certificateMapper
}
