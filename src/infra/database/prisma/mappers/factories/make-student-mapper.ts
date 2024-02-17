import { PrismaEnrollmentsRepository } from '../../repositories/prisma-enrollments-repository'
import { PrismaEvaluationsRepository } from '../../repositories/prisma-evaluations-repository'
import { PrismaStudentCertificatesRepository } from '../../repositories/prisma-student-certificates-repository'
import { StudentMapper } from './../student-mapper'
import { makeEnrollmentMapper } from './make-enrollment-mapper'

export function makeStudentMapper() {
  const enrollmentMapper = makeEnrollmentMapper()

  const prismaEvaluationsRepository = new PrismaEvaluationsRepository()
  const prismaEnrollmentsRepository = new PrismaEnrollmentsRepository(enrollmentMapper)
  const prismaStudentCertificatesRepository = new PrismaStudentCertificatesRepository()

  const studentMapper = new StudentMapper(
    prismaEnrollmentsRepository,
    prismaEvaluationsRepository,
    prismaStudentCertificatesRepository
  )

  return studentMapper
}
