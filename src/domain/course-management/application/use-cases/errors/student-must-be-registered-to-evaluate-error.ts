import { type UseCaseError } from '@/core/errors/use-case-error'

export class StudentMustBeRegisteredToEvaluateError extends Error implements UseCaseError {
  constructor(courseName: string) {
    super(`Student must be registered in ${courseName} to evaluate.`)
  }
}
