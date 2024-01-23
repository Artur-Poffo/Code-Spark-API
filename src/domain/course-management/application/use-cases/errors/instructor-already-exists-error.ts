import { type UseCaseError } from '@/core/errors/use-case-error'

export class InstructorAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Instructor "${identifier}" already exists.`)
  }
}
