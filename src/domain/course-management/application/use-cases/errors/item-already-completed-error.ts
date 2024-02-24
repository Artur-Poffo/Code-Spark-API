import { type UseCaseError } from '@/core/errors/use-case-error'

export class ItemAlreadyCompletedError extends Error implements UseCaseError {
  constructor() {
    super('Item already marked as completed.')
  }
}
