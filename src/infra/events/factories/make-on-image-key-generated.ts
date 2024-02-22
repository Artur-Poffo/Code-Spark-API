import { InMemoryImagesRepository } from './../../../../test/repositories/in-memory-images-repository'
import { OnImageKeyGenerated } from './../../../domain/course-management/application/subscribers/on-image-key-generated'

export function makeOnImageKeyGenerated() {
  const inMemoryImagesRepository = new InMemoryImagesRepository()

  const onImageKeyGenerated = new OnImageKeyGenerated(
    inMemoryImagesRepository
  )

  return onImageKeyGenerated
}
