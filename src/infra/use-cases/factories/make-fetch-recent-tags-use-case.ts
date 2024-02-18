import { FetchRecentTagsUseCase } from '@/domain/course-management/application/use-cases/fetch-recent-tags'
import { makePrismaTagsRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-tags-repository'

export function makeFetchRecentTagsUseCase() {
  const prismaTagsRepository = makePrismaTagsRepository()

  const fetchRecentTagsUseCase = new FetchRecentTagsUseCase(
    prismaTagsRepository
  )

  return fetchRecentTagsUseCase
}
