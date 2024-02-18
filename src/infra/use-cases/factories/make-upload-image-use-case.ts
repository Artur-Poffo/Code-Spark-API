import { UploadImageUseCase } from '@/domain/course-management/application/use-cases/upload-image'
import { InMemoryImagesRepository } from '../../../../test/repositories/in-memory-images-repository'

export function makeUploadImageUseCase() {
  const inMemoryImagesRepository = new InMemoryImagesRepository()

  const uploadImageUseCase = new UploadImageUseCase(
    inMemoryImagesRepository
  )

  return uploadImageUseCase
}
