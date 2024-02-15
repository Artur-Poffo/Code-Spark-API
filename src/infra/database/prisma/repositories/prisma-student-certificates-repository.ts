import { type StudentCertificatesRepository } from '@/domain/course-management/application/repositories/student-certificates-repository'
import { type StudentCertificate } from '@/domain/course-management/enterprise/entities/student-certificate'
import { prisma } from '..'
import { StudentCertificateMapper } from '../mappers/student-certificate-mapper'

export class PrismaStudentCertificatesRepository implements StudentCertificatesRepository {
  async findById(id: string): Promise<StudentCertificate | null> {
    const studentCertificate = await prisma.studentCertificate.findUnique({
      where: {
        id
      }
    })

    if (!studentCertificate) {
      return null
    }

    const domainStudentCertificate = StudentCertificateMapper.toDomain(studentCertificate)

    return domainStudentCertificate
  }

  async findByStudentIdAndCertificateId(studentId: string, certificateId: string): Promise<StudentCertificate | null> {
    const studentCertificate = await prisma.studentCertificate.findFirst({
      where: {
        userId: studentId,
        certificateId
      }
    })

    if (!studentCertificate) {
      return null
    }

    const domainStudentCertificate = StudentCertificateMapper.toDomain(studentCertificate)

    return domainStudentCertificate
  }

  async create(studentCertificate: StudentCertificate): Promise<StudentCertificate> {
    const infraStudentCertificate = StudentCertificateMapper.toPrisma(studentCertificate)

    await prisma.studentCertificate.create({
      data: infraStudentCertificate
    })

    return studentCertificate
  }
}
