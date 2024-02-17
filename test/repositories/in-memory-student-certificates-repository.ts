import { type StudentCertificatesRepository } from '@/domain/course-management/application/repositories/student-certificates-repository'
import { type StudentCertificate } from '@/domain/course-management/enterprise/entities/student-certificate'

export class InMemoryStudentCertificatesRepository implements StudentCertificatesRepository {
  public items: StudentCertificate[] = []

  async findById(id: string): Promise<StudentCertificate | null> {
    const studentCertificate = this.items.find(studentCertificateToFind => studentCertificateToFind.id.toString() === id)

    if (!studentCertificate) {
      return null
    }

    return studentCertificate
  }

  async findByStudentIdAndCertificateId(studentId: string, certificateId: string): Promise<StudentCertificate | null> {
    const studentCertificate = this.items.find(studentCertificateToFind => {
      if (studentCertificateToFind.studentId.toString() === studentId && studentCertificateToFind.certificateId.toString() === certificateId) {
        return studentCertificateToFind
      }

      return null
    })

    if (!studentCertificate) {
      return null
    }

    return studentCertificate
  }

  async findManyByStudentId(studentId: string): Promise<StudentCertificate[]> {
    return this.items.filter(studentCertificateToFilter => studentCertificateToFilter.studentId.toString() === studentId)
  }

  async findManyByCertificateId(certificateId: string): Promise<StudentCertificate[]> {
    return this.items.filter(studentCertificateToFilter => studentCertificateToFilter.certificateId.toString() === certificateId)
  }

  async create(studentCertificate: StudentCertificate): Promise<StudentCertificate> {
    this.items.push(studentCertificate)
    return studentCertificate
  }
}
