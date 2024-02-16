import { type Image } from '../../enterprise/entities/image'

export interface ImagesRepository {
  findById: (id: string) => Promise<Image | null>
  findByImageKey: (key: string) => Promise<Image | null>
  appendImageKey: (imageKey: string, imageId: string) => Promise<Image | null>
  create: (image: Image) => Promise<Image>
}
