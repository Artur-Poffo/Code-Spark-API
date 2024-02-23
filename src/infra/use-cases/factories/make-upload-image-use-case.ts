import { UploadImageUseCase } from '@/domain/course-management/application/use-cases/upload-image'
import { PrismaImagesRepository } from '@/infra/database/prisma/repositories/prisma-images-repository'

export function makeUploadImageUseCase() {
  const prismaImagesRepository = new PrismaImagesRepository()

  const uploadImageUseCase = new UploadImageUseCase(
    prismaImagesRepository
  )

  return uploadImageUseCase
}
