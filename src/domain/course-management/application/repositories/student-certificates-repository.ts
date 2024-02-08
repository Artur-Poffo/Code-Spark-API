import { type StudentCertificate } from '../../enterprise/entities/student-certificate'

export interface StudentCertificatesRepository {
  findById: (id: string) => Promise<StudentCertificate | null>
  findByStudentIdAndCertificateId: (studentId: string, certificateId: string) => Promise<StudentCertificate | null>
  create: (studentCertificate: StudentCertificate) => Promise<StudentCertificate>
}
