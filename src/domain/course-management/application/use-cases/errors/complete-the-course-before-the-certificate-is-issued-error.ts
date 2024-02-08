import { type UseCaseError } from '@/core/errors/use-case-error'

export class CompleteTheCourseBeforeTheCertificateIIsIssuedError extends Error implements UseCaseError {
  constructor() {
    super('Complete the course before the certificate is issued')
  }
}
