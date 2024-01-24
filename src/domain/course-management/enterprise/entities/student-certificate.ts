import { Entity } from '@/core/entities/entity'
import { type UniqueEntityID } from '@/core/entities/unique-entity-id'
import { type Optional } from '@/core/types/optional'

export interface StudentCertificateProps {
  certificateId: UniqueEntityID
  studentId: UniqueEntityID
  issuedAt: Date
}

export class StudentCertificate extends Entity<StudentCertificateProps> {
  get certificateId() {
    return this.props.certificateId
  }

  get studentId() {
    return this.props.studentId
  }

  get issuedAt() {
    return this.props.issuedAt
  }

  static create(
    props: Optional<StudentCertificateProps, 'issuedAt'>,
    id?: UniqueEntityID
  ) {
    const studentCertificate = new StudentCertificate(
      {
        ...props,
        issuedAt: props.issuedAt ?? new Date()
      },
      id
    )

    return studentCertificate
  }
}
