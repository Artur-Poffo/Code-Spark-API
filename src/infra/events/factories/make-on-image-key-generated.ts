import { PrismaImagesRepository } from '@/infra/database/prisma/repositories/prisma-images-repository'
import { OnImageKeyGenerated } from './../../../domain/course-management/application/subscribers/on-image-key-generated'

export function makeOnImageKeyGenerated() {
  const prismaImagesRepository = new PrismaImagesRepository()

  const onImageKeyGenerated = new OnImageKeyGenerated(
    prismaImagesRepository
  )

  return onImageKeyGenerated
}
