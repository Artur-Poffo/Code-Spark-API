import { makeUploadFileUseCase } from '@/infra/use-cases/factories/make-upload-file-use-case'
import { OnImageUploaded } from '../../../domain/storage/application/subscribers/on-image-uploaded'

export function makeOnImageUploaded() {
  const uploadFileUseCase = makeUploadFileUseCase()

  const onImageUploaded = new OnImageUploaded(
    uploadFileUseCase
  )

  return onImageUploaded
}
