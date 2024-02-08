import { type UseCaseError } from '@/core/errors/use-case-error'

export class CertificateHasAlreadyBeenIssued extends Error implements UseCaseError {
  constructor() {
    super('certificate has already been issued.')
  }
}
