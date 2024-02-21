import { PrismaVideosRepository } from '@/infra/database/prisma/repositories/prisma-videos-repository'
import { makeUploadFileUseCase } from '@/infra/use-cases/factories/make-upload-file-use-case'
import { OnVideoUploaded } from '../../../domain/storage/application/subscribers/on-video-uploaded'

export function makeOnVideoUploaded() {
  const uploadFileUseCase = makeUploadFileUseCase()
  const prismaVideosRepository = new PrismaVideosRepository()

  const onVideoUploaded = new OnVideoUploaded(
    uploadFileUseCase,
    prismaVideosRepository
  )

  return onVideoUploaded
}
