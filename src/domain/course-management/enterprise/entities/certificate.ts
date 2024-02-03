import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CertificateProps {
  imageId: UniqueEntityID
  courseId: UniqueEntityID
}

export class Certificate extends Entity<CertificateProps> {
  get imageId() {
    return this.props.imageId
  }

  get courseId() {
    return this.props.courseId
  }

  static create(
    props: CertificateProps,
    id?: UniqueEntityID
  ) {
    const certificate = new Certificate(
      {
        ...props
      },
      id
    )

    return certificate
  }
}
