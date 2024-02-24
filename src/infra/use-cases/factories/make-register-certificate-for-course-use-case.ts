import { RegisterCertificateForCourseUseCase } from '@/domain/course-management/application/use-cases/register-certificate-for-course'
import { makePrismaCertificatesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-certificates-repository'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { PrismaImagesRepository } from '@/infra/database/prisma/repositories/prisma-images-repository'

export function makeRegisterCertificateForCourseUseCase() {
  const prismaCertificatesRepository = makePrismaCertificatesRepository()
  const prismaImagesRepository = new PrismaImagesRepository()
  const prismaCoursesRepository = makePrismaCoursesRepository()

  const registerCertificateForCourseUseCase = new RegisterCertificateForCourseUseCase(
    prismaCertificatesRepository,
    prismaImagesRepository,
    prismaCoursesRepository
  )

  return registerCertificateForCourseUseCase
}
