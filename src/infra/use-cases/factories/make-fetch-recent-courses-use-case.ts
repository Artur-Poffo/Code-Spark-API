import { FetchRecentCoursesUseCase } from '@/domain/course-management/application/use-cases/fetch-recent-courses'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'

export function makeFetchRecentCoursesUseCase() {
  const prismaCoursesRepository = makePrismaCoursesRepository()

  const fetchRecentCoursesUseCase = new FetchRecentCoursesUseCase(
    prismaCoursesRepository
  )

  return fetchRecentCoursesUseCase
}
