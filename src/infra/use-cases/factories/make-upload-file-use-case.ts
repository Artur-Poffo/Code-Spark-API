import { UploadFileUseCase } from '@/domain/storage/application/use-cases/upload-file'
import { makePrismaFilesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-files-repository'
import { R2Storage } from '@/infra/storage/r2-storage'

export function makeUploadFileUseCase() {
  const prismaFilesRepository = makePrismaFilesRepository()
  const R2Uploader = new R2Storage()

  const uploadFileUseCase = new UploadFileUseCase(
    prismaFilesRepository,
    R2Uploader
  )

  return uploadFileUseCase
}
