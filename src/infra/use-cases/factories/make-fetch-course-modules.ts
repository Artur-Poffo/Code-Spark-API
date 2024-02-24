import { FetchCourseModulesUseCase } from '@/domain/course-management/application/use-cases/fetch-course-modules'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { makePrismaModulesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-modules-repository'

export function makeFetchCourseModulesUseCase() {
  const prismaCoursesRepository = makePrismaCoursesRepository()
  const prismaModulesRepository = makePrismaModulesRepository()

  const fetchCourseModulesUseCase = new FetchCourseModulesUseCase(
    prismaCoursesRepository,
    prismaModulesRepository
  )

  return fetchCourseModulesUseCase
}
