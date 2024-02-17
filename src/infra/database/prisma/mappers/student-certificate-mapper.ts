import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { StudentCertificate } from '@/domain/course-management/enterprise/entities/student-certificate'
import { type Prisma, type StudentCertificate as PrismaStudentCertificate } from '@prisma/client'

export class StudentCertificateMapper {
  static toDomain(raw: PrismaStudentCertificate): StudentCertificate {
    return StudentCertificate.create(
      {
        certificateId: new UniqueEntityID(raw.certificateId),
        studentId: new UniqueEntityID(raw.studentId),
        issuedAt: raw.issuedAt
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(studentCertificate: StudentCertificate): Prisma.StudentCertificateUncheckedCreateInput {
    return {
      id: studentCertificate.id.toString(),
      certificateId: studentCertificate.certificateId.toString(),
      studentId: studentCertificate.studentId.toString(),
      issuedAt: studentCertificate.issuedAt
    }
  }
}
