import { GetImageDetailsUseCase } from '@/domain/course-management/application/use-cases/get-image-details'
import { PrismaImagesRepository } from '@/infra/database/prisma/repositories/prisma-images-repository'

export function makeGetImageDetailsUseCase() {
  const prismaImagesRepository = new PrismaImagesRepository()

  const getImageDetailsUseCase = new GetImageDetailsUseCase(
    prismaImagesRepository
  )

  return getImageDetailsUseCase
}
