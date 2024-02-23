import { type Prisma } from '@prisma/client'

export class StudentCertificatePresenter {
  static toHTTP(studentCertificate: Prisma.StudentCertificateUncheckedCreateInput) {
    return {
      id: studentCertificate.id,
      certificateId: studentCertificate.certificateId,
      studentId: studentCertificate.studentId,
      issuedAt: studentCertificate.issuedAt
    }
  }
}
