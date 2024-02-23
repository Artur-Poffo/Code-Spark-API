import { OnFileUploaded } from '@/domain/course-management/application/subscribers/on-file-uploaded'
import { PrismaImagesRepository } from '@/infra/database/prisma/repositories/prisma-images-repository'
import { PrismaVideosRepository } from '@/infra/database/prisma/repositories/prisma-videos-repository'

export function makeOnFileUploaded() {
  const prismaImagesRepository = new PrismaImagesRepository()
  const prismaVideosRepository = new PrismaVideosRepository()

  const onVideoKeyGenerated = new OnFileUploaded(
    prismaImagesRepository,
    prismaVideosRepository
  )

  return onVideoKeyGenerated
}
