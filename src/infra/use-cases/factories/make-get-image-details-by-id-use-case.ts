import { GetImageDetailsByIdByIdUseCase } from '@/domain/course-management/application/use-cases/get-image-details-by-id'
import { PrismaImagesRepository } from '@/infra/database/prisma/repositories/prisma-images-repository'

export function makeGetImageDetailsByIdUseCase() {
  const prismaImagesRepository = new PrismaImagesRepository()

  const getImageDetailsByIdUseCase = new GetImageDetailsByIdByIdUseCase(
    prismaImagesRepository
  )

  return getImageDetailsByIdUseCase
}
