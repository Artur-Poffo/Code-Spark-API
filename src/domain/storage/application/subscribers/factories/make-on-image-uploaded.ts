import { makeUploadFileUseCase } from '@/infra/use-cases/factories/make-upload-file-use-case'
import { InMemoryImagesRepository } from './../../../../../../test/repositories/in-memory-images-repository'
import { OnImageUploaded } from './../on-image-uploaded'

export function makeOnImageUploaded() {
  const uploadFileUseCase = makeUploadFileUseCase()
  const inMemoryImagesRepository = new InMemoryImagesRepository()

  const onImageUploaded = new OnImageUploaded(
    uploadFileUseCase,
    inMemoryImagesRepository
  )

  return onImageUploaded
}
