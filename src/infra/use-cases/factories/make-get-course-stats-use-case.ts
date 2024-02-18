import { GetCourseStatsUseCase } from '@/domain/course-management/application/use-cases/get-course-stats'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { makePrismaModulesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-modules-repository'
import { PrismaVideosRepository } from '@/infra/database/prisma/repositories/prisma-videos-repository'

export function makeGetCourseStatsUseCase() {
  const prismaCoursesRepository = makePrismaCoursesRepository()
  const prismaVideosRepository = new PrismaVideosRepository()
  const prismaModulesRepository = makePrismaModulesRepository()

  const getCourseStatsUseCase = new GetCourseStatsUseCase(
    prismaCoursesRepository,
    prismaVideosRepository,
    prismaModulesRepository
  )

  return getCourseStatsUseCase
}
