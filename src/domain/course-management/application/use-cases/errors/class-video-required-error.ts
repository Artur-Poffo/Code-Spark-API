import { type UseCaseError } from '@/core/errors/use-case-error'

export class ClassVideoRequiredError extends Error implements UseCaseError {
  constructor() {
    super('Class video is required.')
  }
}
