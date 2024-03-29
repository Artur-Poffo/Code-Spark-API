import { type ImagesRepository } from '@/domain/course-management/application/repositories/images-repository'
import { type Image } from '@/domain/course-management/enterprise/entities/image'

export class InMemoryImagesRepository implements ImagesRepository {
  items: Image[] = []

  async findById(id: string): Promise<Image | null> {
    const image = this.items.find(imageToCompare => imageToCompare.id.toString() === id)

    if (!image) {
      return null
    }

    return image
  }

  async findByImageKey(key: string): Promise<Image | null> {
    const image = this.items.find(imageToCompare => imageToCompare.imageKey?.toString() === key)

    if (!image) {
      return null
    }

    return image
  }

  async appendImageKey(imageKey: string, id: string): Promise<Image | null> {
    const imageToAppendKey = this.items.find(imageToCompare => imageToCompare.id.toString() === id)

    if (!imageToAppendKey) {
      return null
    }

    if (!imageToAppendKey.imageKey) {
      imageToAppendKey.imageKey = imageKey
      const imageIndex = this.items.indexOf(imageToAppendKey)

      this.items[imageIndex] = imageToAppendKey
    }

    return imageToAppendKey
  }

  async create(image: Image): Promise<Image> {
    this.items.push(image)

    return image
  }
}
