import { PrismaVideosRepository } from '@/infra/database/prisma/repositories/prisma-videos-repository'
import { OnVideoKeyGenerated } from './../../../domain/course-management/application/subscribers/on-video-key-generated'

export function makeOnVideoKeyGenerated() {
  const prismaVideosRepository = new PrismaVideosRepository()

  const onVideoKeyGenerated = new OnVideoKeyGenerated(
    prismaVideosRepository
  )

  return onVideoKeyGenerated
}
