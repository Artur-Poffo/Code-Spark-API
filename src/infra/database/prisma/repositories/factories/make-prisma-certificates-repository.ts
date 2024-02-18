import { makeCertificateMapper } from '../../mappers/factories/make-certificate-mapper'
import { PrismaCertificatesRepository } from './../prisma-certificates-repository'

export function makePrismaCertificatesRepository() {
  const certificateMapper = makeCertificateMapper()
  const prismaCertificatesRepository = new PrismaCertificatesRepository(certificateMapper)

  return prismaCertificatesRepository
}
