import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type ImagesRepository } from '@/domain/course-management/application/repositories/images-repository'
import { Certificate } from '@/domain/course-management/enterprise/entities/certificate'
import { type Prisma, type Certificate as PrismaCertificate } from '@prisma/client'

export class CertificateMapper {
  constructor(
    private readonly imagesRepository: ImagesRepository
  ) {}

  async toDomain(raw: PrismaCertificate): Promise<Certificate | null> {
    const image = await this.imagesRepository.findByImageKey(raw.imageKey)

    if (!image) {
      return null
    }

    return Certificate.create(
      {
        courseId: new UniqueEntityID(raw.courseId),
        imageId: new UniqueEntityID(image.id.toString())
      },
      new UniqueEntityID(raw.id)
    )
  }

  async toPrisma(certificate: Certificate): Promise<Prisma.CertificateUncheckedCreateInput | null> {
    const image = await this.imagesRepository.findById(certificate.imageId.toString())

    if (!image) {
      return null
    }

    if (!image.imageKey) {
      return null
    }

    return {
      id: certificate.id.toString(),
      courseId: certificate.courseId.toString(),
      imageKey: image.imageKey
    }
  }
}
