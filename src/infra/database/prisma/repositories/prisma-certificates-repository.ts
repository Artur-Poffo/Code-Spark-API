import { type CertificatesRepository } from '@/domain/course-management/application/repositories/certificates-repository'
import { type Certificate } from '@/domain/course-management/enterprise/entities/certificate'
import { prisma } from '..'
import { CertificateMapper } from '../mappers/certificate-mapper'

export class PrismaCertificatesRepository implements CertificatesRepository {
  async findById(id: string): Promise<Certificate | null> {
    const certificate = await prisma.certificate.findUnique({
      where: {
        id
      }
    })

    if (!certificate) {
      return null
    }

    const domainCertificate = CertificateMapper.toDomain(certificate)

    return domainCertificate
  }

  async findByCourseId(courseId: string): Promise<Certificate | null> {
    const certificate = await prisma.certificate.findUnique({
      where: {
        courseId
      }
    })

    if (!certificate) {
      return null
    }

    const domainCertificate = CertificateMapper.toDomain(certificate)

    return domainCertificate
  }

  async create(certificate: Certificate): Promise<Certificate> {
    const infraCertificate = CertificateMapper.toPrisma(certificate)

    await prisma.certificate.create({
      data: infraCertificate
    })

    return certificate
  }
}
