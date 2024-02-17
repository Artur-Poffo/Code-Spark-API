import { type Certificate } from '../../enterprise/entities/certificate'

export interface CertificatesRepository {
  findById: (id: string) => Promise<Certificate | null>
  findByCourseId: (courseId: string) => Promise<Certificate | null>
  create: (certificate: Certificate) => Promise<Certificate | null>
}
