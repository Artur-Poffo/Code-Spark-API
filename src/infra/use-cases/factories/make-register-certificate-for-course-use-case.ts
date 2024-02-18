import { RegisterCertificateForCourseUseCase } from '@/domain/course-management/application/use-cases/register-certificate-for-course'
import { makePrismaCertificatesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-certificates-repository'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { InMemoryImagesRepository } from '../../../../test/repositories/in-memory-images-repository'

export function makeRegisterCertificateForCourseUseCase() {
  const prismaCertificatesRepository = makePrismaCertificatesRepository()
  const inMemoryImagesRepository = new InMemoryImagesRepository()
  const prismaCoursesRepository = makePrismaCoursesRepository()

  const registerCertificateForCourseUseCase = new RegisterCertificateForCourseUseCase(
    prismaCertificatesRepository,
    inMemoryImagesRepository,
    prismaCoursesRepository
  )

  return registerCertificateForCourseUseCase
}
