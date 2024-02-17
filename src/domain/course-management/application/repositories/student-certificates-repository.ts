import { type StudentCertificate } from '../../enterprise/entities/student-certificate'

export interface StudentCertificatesRepository {
  findById: (id: string) => Promise<StudentCertificate | null>
  findByStudentIdAndCertificateId: (studentId: string, certificateId: string) => Promise<StudentCertificate | null>
  findManyByStudentId: (studentId: string) => Promise<StudentCertificate[]>
  findManyByCertificateId: (certificateId: string) => Promise<StudentCertificate[]>
  create: (studentCertificate: StudentCertificate) => Promise<StudentCertificate>
}
