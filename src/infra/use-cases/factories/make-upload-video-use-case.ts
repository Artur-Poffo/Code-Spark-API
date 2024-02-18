import { UploadVideoUseCase } from '@/domain/course-management/application/use-cases/upload-video'
import { PrismaVideosRepository } from './../../database/prisma/repositories/prisma-videos-repository'

export function makeUploadVideoUseCase() {
  const prismaVideosRepository = new PrismaVideosRepository()

  const uploadVideoUseCase = new UploadVideoUseCase(
    prismaVideosRepository
  )

  return uploadVideoUseCase
}
