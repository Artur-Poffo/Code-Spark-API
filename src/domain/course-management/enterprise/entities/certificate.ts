import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CertificateProps {
  imageKey: string
  courseId: UniqueEntityID
}

export class Certificate extends Entity<CertificateProps> {
  get imageKey() {
    return this.props.imageKey
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
