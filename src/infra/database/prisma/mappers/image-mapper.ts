import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Image } from '@/domain/course-management/enterprise/entities/image'
import { type Prisma } from '@prisma/client'

export class ImageMapper {
  static toDomain(raw: Prisma.ImageGetPayload<{ include: { file: true } }>): Image | null {
    if (!raw.file) {
      return null
    }

    if (raw.file.type !== 'image/jpeg' && raw.file.type !== 'image/png') {
      return null
    }

    return Image.create(
      {
        imageName: raw.file.name,
        imageKey: raw.fileKey,
        body: raw.file.body,
        imageType: raw.file.type as 'image/jpeg' | 'image/png',
        size: Number(raw.file.size),
        storedAt: raw.file.storedAt
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(image: Image): Prisma.ImageUncheckedCreateInput {
    return {
      id: image.id.toString(),
      fileKey: image.imageKey
    }
  }
}
