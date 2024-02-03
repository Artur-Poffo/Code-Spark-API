import { type CertificatesRepository } from '@/domain/course-management/application/repositories/certificates-repository'
import { type Certificate } from '@/domain/course-management/enterprise/entities/certificate'

export class InMemoryCertificatesRepository implements CertificatesRepository {
  items: Certificate[] = []

  async findById(id: string): Promise<Certificate | null> {
    const certificate = this.items.find(certificateToCompare => certificateToCompare.id.toString() === id)

    if (!certificate) {
      return null
    }

    return certificate
  }

  async findByCourseId(courseId: string): Promise<Certificate | null> {
    const certificate = this.items.find(certificateToCompare => certificateToCompare.courseId.toString() === courseId)

    if (!certificate) {
      return null
    }

    return certificate
  }

  async create(certificate: Certificate): Promise<Certificate> {
    this.items.push(certificate)
    return certificate
  }
}
