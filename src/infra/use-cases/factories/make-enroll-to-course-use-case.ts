import { EnrollToCourseUseCase } from '@/domain/course-management/application/use-cases/enroll-to-course'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { makePrismaEnrollmentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-enrollments-repository'
import { makePrismaStudentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-students-repository'

export function makeEnrollToCourseUseCase() {
  const prismaEnrollmentsRepository = makePrismaEnrollmentsRepository()
  const prismaStudentsRepository = makePrismaStudentsRepository()
  const prismaCoursesRepository = makePrismaCoursesRepository()

  const enrollToCourseUseCase = new EnrollToCourseUseCase(
    prismaEnrollmentsRepository,
    prismaStudentsRepository,
    prismaCoursesRepository
  )

  return enrollToCourseUseCase
}
