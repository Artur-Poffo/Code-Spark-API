import { type UseCaseError } from '@/core/errors/use-case-error'

export class StudentAlreadyEvaluateThisClassError extends Error implements UseCaseError {
  constructor(className: string) {
    super(`Student already evaluate the class: ${className}.`)
  }
}
