import { type ImagesRepository } from '@/domain/course-management/application/repositories/images-repository'
import { type Image } from '@/domain/course-management/enterprise/entities/image'
import { prisma } from '..'
import { ImageMapper } from '../mappers/image-mapper'

export class PrismaImagesRepository implements ImagesRepository {
  async findById(id: string): Promise<Image | null> {
    const image = await prisma.image.findUnique({
      where: {
        id
      },
      include: {
        file: true
      }
    })

    if (!image) {
      return null
    }

    const domainImage = ImageMapper.toDomain(image)

    return domainImage
  }

  async findByImageKey(key: string): Promise<Image | null> {
    const image = await prisma.image.findUnique({
      where: {
        fileKey: key
      },
      include: {
        file: true
      }
    })

    if (!image) {
      return null
    }

    const domainImage = ImageMapper.toDomain(image)

    return domainImage
  }

  async appendImageKey(imageKey: string, imageId: string): Promise<Image | null> {
    const image = await prisma.image.findUnique({
      where: {
        id: imageId
      },
      include: {
        file: true
      }
    })

    if (!image) {
      return null
    }

    await prisma.image.update({
      where: { id: imageId },
      data: {
        fileKey: imageKey
      }
    })

    const domainImage = ImageMapper.toDomain(image)

    return domainImage
  }

  async create(image: Image): Promise<Image> {
    const infraImage = ImageMapper.toPrisma(image)

    await prisma.image.create({
      data: infraImage
    })

    return image
  }
}
