import { type UseCaseError } from '@/core/errors/use-case-error'

export class InvalidEvaluationValueError extends Error implements UseCaseError {
  constructor() {
    super('Invalid evaluation value.')
  }
}
