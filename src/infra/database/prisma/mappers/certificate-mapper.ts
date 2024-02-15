import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Certificate } from '@/domain/course-management/enterprise/entities/certificate'
import { type Prisma, type Certificate as PrismaCertificate } from '@prisma/client'

export class CertificateMapper {
  static toDomain(raw: PrismaCertificate): Certificate {
    return Certificate.create(
      {
        courseId: new UniqueEntityID(raw.courseId),
        imageId: new UniqueEntityID('')
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(certificate: Certificate): Prisma.CertificateUncheckedCreateInput {
    return {
      id: certificate.id.toString(),
      courseId: certificate.courseId.toString(),
      imageKey: ''
    }
  }
}
