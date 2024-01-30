import { type UseCaseError } from '@/core/errors/use-case-error'

export class RepeatedTagError extends Error implements UseCaseError {
  constructor() {
    super('Repeated tag found')
  }
}
