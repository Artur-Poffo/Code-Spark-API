import { type UseCaseError } from '@/core/errors/use-case-error'

export class InvalidMimeTypeError extends Error implements UseCaseError {
  constructor(mimeType: string) {
    super(`Invalid Mime Type: ${mimeType}.`)
  }
}
