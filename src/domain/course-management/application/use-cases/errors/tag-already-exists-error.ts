import { type UseCaseError } from '@/core/errors/use-case-error'

export class TagAlreadyExistsError extends Error implements UseCaseError {
  constructor(name: string) {
    super(`Tag "${name}" already exists.`)
  }
}
