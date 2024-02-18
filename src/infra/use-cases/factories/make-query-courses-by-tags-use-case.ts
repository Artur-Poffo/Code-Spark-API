import { QueryCoursesByTagsUseCase } from '@/domain/course-management/application/use-cases/query-courses-by-tags'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { makePrismaTagsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-tags-repository'

export function makeQueryCoursesByTagsUseCase() {
  const prismaCoursesRepository = makePrismaCoursesRepository()
  const prismaTagsRepository = makePrismaTagsRepository()

  const queryCoursesByTagsUseCase = new QueryCoursesByTagsUseCase(
    prismaCoursesRepository,
    prismaTagsRepository
  )

  return queryCoursesByTagsUseCase
}
