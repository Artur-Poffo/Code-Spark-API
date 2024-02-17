import { PrismaCourseTagsRepository } from '../../repositories/prisma-course-tags-repository'
import { PrismaEnrollmentsRepository } from '../../repositories/prisma-enrollments-repository'
import { PrismaCertificatesRepository } from './../../repositories/prisma-certificates-repository'
import { PrismaModulesRepository } from './../../repositories/prisma-modules-repository'
import { CourseMapper } from './../course-mapper'
import { makeCertificateMapper } from './make-certificate-mapper'
import { makeEnrollmentMapper } from './make-enrollment-mapper'
import { makeModuleMapper } from './make-module-mapper'

export function makeCourseMapper() {
  const certificateMapper = makeCertificateMapper()
  const enrollmentMapper = makeEnrollmentMapper()
  const moduleMapper = makeModuleMapper()

  const prismaCertificatesRepository = new PrismaCertificatesRepository(certificateMapper)
  const prismaCourseTagsRepository = new PrismaCourseTagsRepository()
  const prismaEnrollmentsRepository = new PrismaEnrollmentsRepository(enrollmentMapper)
  const prismaModulesRepository = new PrismaModulesRepository(moduleMapper)

  const courseMapper = new CourseMapper(
    prismaCertificatesRepository,
    prismaCourseTagsRepository,
    prismaEnrollmentsRepository,
    prismaModulesRepository
  )

  return courseMapper
}
