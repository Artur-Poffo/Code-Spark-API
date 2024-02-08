import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Certificate, type CertificateProps } from '@/domain/course-management/enterprise/entities/certificate'

export function makeCertificate(
  override: Partial<CertificateProps> = {},
  id?: UniqueEntityID
) {
  const certificate = Certificate.create(
    {
      courseId: override.courseId ?? new UniqueEntityID(),
      imageId: override.imageId ?? new UniqueEntityID(),
      ...override
    },
    id
  )

  return certificate
}
