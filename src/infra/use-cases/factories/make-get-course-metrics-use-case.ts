import { GetCourseMetricsUseCase } from '@/domain/course-management/application/use-cases/get-course-metrics'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { makePrismaEnrollmentsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-enrollments-repository'
import { makePrismaInstructorsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-instructors-repository'

export function makeGetCourseMetricsUseCase() {
  const prismaCoursesRepository = makePrismaCoursesRepository()
  const prismaEnrollmentsRepository = makePrismaEnrollmentsRepository()
  const prismaInstructorsRepository = makePrismaInstructorsRepository()

  const getCourseMetricsUseCase = new GetCourseMetricsUseCase(
    prismaCoursesRepository,
    prismaEnrollmentsRepository,
    prismaInstructorsRepository
  )

  return getCourseMetricsUseCase
}
