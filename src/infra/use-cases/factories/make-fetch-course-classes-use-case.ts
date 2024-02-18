import { FetchCourseClassesUseCase } from '@/domain/course-management/application/use-cases/fetch-course-classes'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { makePrismaModulesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-modules-repository'

export function makeFetchCourseClassesUseCase() {
  const prismaCoursesRepository = makePrismaCoursesRepository()
  const prismaModulesRepository = makePrismaModulesRepository()

  const fetchCourseClassesUseCase = new FetchCourseClassesUseCase(
    prismaCoursesRepository,
    prismaModulesRepository
  )

  return fetchCourseClassesUseCase
}
