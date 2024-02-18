import { FetchCourseTagsUseCase } from '@/domain/course-management/application/use-cases/fetch-course-tags'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { makePrismaTagsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-tags-repository'
import { PrismaCourseTagsRepository } from '@/infra/database/prisma/repositories/prisma-course-tags-repository'

export function makeFetchCourseTagsUseCase() {
  const prismaCoursesRepository = makePrismaCoursesRepository()
  const prismaCourseTagsRepository = new PrismaCourseTagsRepository()
  const prismaTagsRepository = makePrismaTagsRepository()

  const fetchCourseTagsUseCase = new FetchCourseTagsUseCase(
    prismaCoursesRepository,
    prismaCourseTagsRepository,
    prismaTagsRepository
  )

  return fetchCourseTagsUseCase
}
