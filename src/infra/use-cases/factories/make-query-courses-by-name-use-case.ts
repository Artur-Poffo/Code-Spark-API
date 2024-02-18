import { QueryCoursesByNameUseCase } from '@/domain/course-management/application/use-cases/query-courses-by-name'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'

export function makeQueryCoursesByNameUseCase() {
  const prismaCoursesRepository = makePrismaCoursesRepository()

  const queryCoursesByNameUseCase = new QueryCoursesByNameUseCase(
    prismaCoursesRepository
  )

  return queryCoursesByNameUseCase
}
