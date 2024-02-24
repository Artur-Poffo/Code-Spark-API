import { type Prisma } from '@prisma/client'

export class ImagePresenter {
  static toHTTP(image: Prisma.ImageUncheckedCreateInput) {
    return {
      id: image.id,
      imageKey: image.fileKey
    }
  }
}
