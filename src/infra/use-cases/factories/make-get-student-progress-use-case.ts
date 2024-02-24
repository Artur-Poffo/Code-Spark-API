import { GetStudentProgressUseCase } from '@/domain/course-management/application/use-cases/get-student-progress'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { makePrismaEnrollmentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-enrollments-repository'
import { makePrismaModulesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-modules-repository'
import { PrismaEnrollmentCompleteItemsRepository } from '@/infra/database/prisma/repositories/prisma-enrollment-completed-items-repository'

export function makeGetStudentProgressUseCase() {
  const prismaEnrollmentsRepository = makePrismaEnrollmentsRepository()
  const prismaCoursesRepository = makePrismaCoursesRepository()
  const prismaModulesRepository = makePrismaModulesRepository()
  const prismaEnrollmentCompleteItemsRepository = new PrismaEnrollmentCompleteItemsRepository()

  const getStudentProgressUseCase = new GetStudentProgressUseCase(
    prismaEnrollmentsRepository,
    prismaCoursesRepository,
    prismaModulesRepository,
    prismaEnrollmentCompleteItemsRepository
  )

  return getStudentProgressUseCase
}
