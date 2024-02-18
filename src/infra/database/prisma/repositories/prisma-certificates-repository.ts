import { type CertificatesRepository } from '@/domain/course-management/application/repositories/certificates-repository'
import { type Certificate } from '@/domain/course-management/enterprise/entities/certificate'
import { prisma } from '..'
import { type CertificateMapper } from '../mappers/certificate-mapper'

export class PrismaCertificatesRepository implements CertificatesRepository {
  constructor(
    private readonly certificateMapper: CertificateMapper
  ) {}

  async findById(id: string): Promise<Certificate | null> {
    const certificate = await prisma.certificate.findUnique({
      where: {
        id
      }
    })

    if (!certificate) {
      return null
    }

    const domainCertificate = await this.certificateMapper.toDomain(certificate)

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

    const domainCertificate = await this.certificateMapper.toDomain(certificate)

    return domainCertificate
  }

  async create(certificate: Certificate): Promise<Certificate | null> {
    const infraCertificate = await this.certificateMapper.toPrisma(certificate)

    if (!infraCertificate) {
      return null
    }

    await prisma.certificate.create({
      data: infraCertificate
    })

    return certificate
  }

  async delete(certificate: Certificate): Promise<void> {
    await prisma.certificate.delete({
      where: {
        id: certificate.id.toString()
      }
    })
  }
}
