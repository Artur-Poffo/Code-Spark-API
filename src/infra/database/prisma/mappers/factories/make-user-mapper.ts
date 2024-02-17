import { PrismaCoursesRepository } from '../../repositories/prisma-courses-repository'
import { PrismaEnrollmentsRepository } from '../../repositories/prisma-enrollments-repository'
import { PrismaEvaluationsRepository } from '../../repositories/prisma-evaluations-repository'
import { PrismaStudentCertificatesRepository } from '../../repositories/prisma-student-certificates-repository'
import { UserMapper } from './../user-mapper'
import { makeCourseMapper } from './make-course-mapper'
import { makeEnrollmentMapper } from './make-enrollment-mapper'

export function makeUserMapper() {
  const enrollmentMapper = makeEnrollmentMapper()
  const courseMapper = makeCourseMapper()

  const prismaCoursesRepository = new PrismaCoursesRepository(
    courseMapper
  )
  const prismaEvaluationsRepository = new PrismaEvaluationsRepository()
  const prismaEnrollmentsRepository = new PrismaEnrollmentsRepository(enrollmentMapper)
  const prismaStudentCertificatesRepository = new PrismaStudentCertificatesRepository()

  const userMapper = new UserMapper(
    prismaCoursesRepository,
    prismaEnrollmentsRepository,
    prismaEvaluationsRepository,
    prismaStudentCertificatesRepository
  )

  return userMapper
}
