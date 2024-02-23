import { GetVideoDetailsUseCase } from '@/domain/course-management/application/use-cases/get-video-details'
import { PrismaVideosRepository } from '@/infra/database/prisma/repositories/prisma-videos-repository'

export function makeGetVideoDetailsUseCase() {
  const prismaVideosRepository = new PrismaVideosRepository()

  const getVideoDetailsUseCase = new GetVideoDetailsUseCase(
    prismaVideosRepository
  )

  return getVideoDetailsUseCase
}
