import { GetVideoDetailsByIdUseCase } from '@/domain/course-management/application/use-cases/get-video-details-by-id'
import { PrismaVideosRepository } from '@/infra/database/prisma/repositories/prisma-videos-repository'

export function makeGetVideoDetailsByIdUseCase() {
  const prismaVideosRepository = new PrismaVideosRepository()

  const getVideoDetailsByIdUseCase = new GetVideoDetailsByIdUseCase(
    prismaVideosRepository
  )

  return getVideoDetailsByIdUseCase
}
