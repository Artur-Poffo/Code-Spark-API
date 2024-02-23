import { OnFileUploaded } from '@/domain/course-management/application/subscribers/on-file-uploaded'
import { PrismaImagesRepository } from '@/infra/database/prisma/repositories/prisma-images-repository'
import { PrismaVideosRepository } from '@/infra/database/prisma/repositories/prisma-videos-repository'
import { GetVideoDuration } from './../../storage/utils/get-video-duration'

export function makeOnFileUploaded() {
  const prismaImagesRepository = new PrismaImagesRepository()
  const prismaVideosRepository = new PrismaVideosRepository()
  const getVideoDuration = new GetVideoDuration()

  const onVideoKeyGenerated = new OnFileUploaded(
    prismaImagesRepository,
    prismaVideosRepository,
    getVideoDuration
  )

  return onVideoKeyGenerated
}
