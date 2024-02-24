import { PrismaImagesRepository } from '@/infra/database/prisma/repositories/prisma-images-repository'
import { PrismaStudentCertificatesRepository } from '../../repositories/prisma-student-certificates-repository'
import { CertificateMapper } from '../certificate-mapper'

export function makeCertificateMapper() {
  const prismaImagesRepository = new PrismaImagesRepository()
  const prismaStudentCertificatesRepository = new PrismaStudentCertificatesRepository()

  const certificateMapper = new CertificateMapper(
    prismaImagesRepository,
    prismaStudentCertificatesRepository
  )

  return certificateMapper
}
